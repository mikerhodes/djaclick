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
	ticker := time.NewTicker(100 * time.Millisecond)

	methods := []string{"GET", "POST"}
	statuses := []string{"200", "404", "500"}
	paths := []string{"/coffee", "/tea", "/water"}

	for {
		select {
		case <-ticker.C:
			count := rand.Intn(20)
			h := hit{
				TS:     time.Now().Format("2006-01-02T15:04:05"),
				Status: statuses[rand.Intn(len(statuses))],
				Method: methods[rand.Intn(len(methods))],
				Path:   paths[rand.Intn(len(paths))],
			}
			data, _ := json.Marshal(h)
			for i := 0; i < count; i++ {
				fmt.Println(string(data))
			}
		}
	}
}
