package worker

import (
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"strings"
	"time"
)

type jwtHeader struct {
	Alg string `json:"alg"`
	Typ string `json:"typ"`
}

type jwtClaims struct {
	Iss   string `json:"iss"`
	Sub   string `json:"sub"`
	Scope string `json:"scope"`
	Aud   string `json:"aud"`
	Iat   int64  `json:"iat"`
	Exp   int64  `json:"exp"`
}

func buildServiceAccountJWT(sa *googleServiceAccount, delegatedUser, scope string, now time.Time) (string, error) {
	key, err := parseServiceAccountPrivateKey(sa.PrivateKey)
	if err != nil {
		return "", err
	}
	headerJSON, _ := json.Marshal(jwtHeader{Alg: "RS256", Typ: "JWT"})
	claimsJSON, _ := json.Marshal(jwtClaims{
		Iss:   sa.ClientEmail,
		Sub:   delegatedUser,
		Scope: scope,
		Aud:   sa.TokenURI,
		Iat:   now.Unix(),
		Exp:   now.Add(1 * time.Hour).Unix(),
	})

	encodedHeader := base64.RawURLEncoding.EncodeToString(headerJSON)
	encodedClaims := base64.RawURLEncoding.EncodeToString(claimsJSON)
	unsignedToken := encodedHeader + "." + encodedClaims

	sum := sha256.Sum256([]byte(unsignedToken))
	signature, err := rsa.SignPKCS1v15(rand.Reader, key, crypto.SHA256, sum[:])
	if err != nil {
		return "", err
	}
	return unsignedToken + "." + base64.RawURLEncoding.EncodeToString(signature), nil
}

func parseServiceAccountPrivateKey(privateKeyPEM string) (*rsa.PrivateKey, error) {
	block, _ := pem.Decode([]byte(strings.TrimSpace(privateKeyPEM)))
	if block == nil {
		return nil, fmt.Errorf("%w: invalid_service_account_private_key", ErrPermanent)
	}
	if key, err := x509.ParsePKCS8PrivateKey(block.Bytes); err == nil {
		rsaKey, ok := key.(*rsa.PrivateKey)
		if !ok {
			return nil, fmt.Errorf("%w: non_rsa_service_account_key", ErrPermanent)
		}
		return rsaKey, nil
	}
	if key, err := x509.ParsePKCS1PrivateKey(block.Bytes); err == nil {
		return key, nil
	}
	return nil, fmt.Errorf("%w: unsupported_service_account_key", ErrPermanent)
}
