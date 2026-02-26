package worker

import (
	"encoding/json"
	"time"
)

type orderAggregate struct {
	ID             string
	Email          string
	Currency       string
	Status         string
	PaymentStatus  string
	SubtotalAmount int
	ShippingAmount int
	TaxAmount      int
	TotalAmount    int
	ShippingRaw    []byte
	CreatedAt      time.Time
	Items          []orderItemAggregate
}

type orderItemAggregate struct {
	SKU             string
	Title           string
	Quantity        int
	UnitPriceAmount int
}

type invoiceRecord struct {
	OrderID       string
	InvoiceNumber string
	Currency      string
	Subtotal      int
	Shipping      int
	Tax           int
	Total         int
	PDFPath       string
	PDFSHA256     string
}

func (o *orderAggregate) shippingAddressMap() map[string]any {
	if len(o.ShippingRaw) == 0 {
		return map[string]any{}
	}
	out := map[string]any{}
	_ = json.Unmarshal(o.ShippingRaw, &out)
	return out
}
