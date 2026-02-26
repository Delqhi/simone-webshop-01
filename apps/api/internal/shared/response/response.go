package response

import "github.com/gin-gonic/gin"

type ErrorBody struct {
	Error string `json:"error"`
}

func OK(c *gin.Context, payload any) {
	c.JSON(200, payload)
}

func Created(c *gin.Context, payload any) {
	c.JSON(201, payload)
}

func BadRequest(c *gin.Context, msg string) {
	c.JSON(400, ErrorBody{Error: msg})
}

func Unauthorized(c *gin.Context, msg string) {
	c.JSON(401, ErrorBody{Error: msg})
}

func Forbidden(c *gin.Context, msg string) {
	c.JSON(403, ErrorBody{Error: msg})
}

func Internal(c *gin.Context, msg string) {
	c.JSON(500, ErrorBody{Error: msg})
}
