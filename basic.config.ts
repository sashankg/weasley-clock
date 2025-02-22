// basic.config.ts lets you define the schema for your database
// after updating this file, you may need to restart the dev server
// docs: https://docs.basic.tech/info/schema 

export const schema = {
  "project_id": "c64278ad-7e9f-4fed-bf14-5af221796833",
  "tables": {
    "places": {
      "type": "collection",
      "fields": {
        "name": {
          "type": "string",
          "indexed": true
        },
        "lat": {
          "type": "number",
          "indexed": true
        },
        "long": {
          "type": "number",
          "indexed": true
        }
      }
    },
    "log": {
      "type": "collection",
      "fields": {
        "lat": {
          "type": "number",
          "indexed": true
        },
        "long": {
          "type": "number",
          "indexed": true
        }
      }
    },
    "friends": {
      "type": "collection",
      "fields": {
        "token": {
          "type": "string",
          "indexed": true
        },
        "name": {
          "type": "string",
          "indexed": true
        }
      }
    }
  },
  "version": 1
}