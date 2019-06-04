package models

import (
	"time"
)

const DateFormat = "2006-01-02"

type DateTime time.Time

func (date DateTime) MarshalJSON() ([]byte, error) {
	b := make([]byte, 0, 14)
	b = append(b, '"')
	b = time.Time(date).AppendFormat(b, DateFormat)
	b = append(b, '"')
	return b, nil
}

func (date *DateTime) UnmarshalJSON(data []byte) error {
	now, err := time.ParseInLocation(`"`+DateFormat+`"`, string(data), time.Local)
	if err != nil {
		return err
	}
	*date = DateTime(now)
	return nil
}

func (date DateTime) String() string {
	return time.Time(date).Format(DateFormat)
}

func (date DateTime) ToTime() time.Time {
	return time.Time(date)
}
