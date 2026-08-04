package config

import "time"

const (
    ServerPort     = ":8080"
    MessageTTL     = 24 * time.Hour
    CleanupInterval = 5 * time.Minute
)