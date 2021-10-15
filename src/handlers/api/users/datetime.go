package main

import "time"

type DateTime struct {
	DateTime string
}

func (t DateTime) String() string {
	return t.DateTime
}

func NewTime() DateTime {
	return DateTime{
		DateTime: time.Now().UTC().Format(time.RFC3339),
	}
}
