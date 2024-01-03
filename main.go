package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"time"
)

// CREATE TABLE hits
// (
//     `ts` DateTime,
//     `status` LowCardinality(String),
//     `method` LowCardinality(String),
//     `path` String
// )
// ENGINE = MergeTree
// ORDER BY ts

type hit struct {
	TS     string `json:"ts"`
	Status string `json:"status"`
	Method string `json:"method"`
	Path   string `json:"path"`
}

func main() {
	ticker := time.NewTicker(500 * time.Millisecond)

	for {
		select {
		case <-ticker.C:
			count := rand.Intn(50)
			for i := 0; i < count; i++ {
				h := hit{TS: time.Now().Format("2006-01-02T15:04:05"), Status: "200", Method: "GET", Path: "/foo"}
				data, _ := json.Marshal(h)
				fmt.Println(string(data))
			}
		}
	}
}
