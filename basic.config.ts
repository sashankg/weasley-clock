// basic.config.ts lets you define the schema for your database
// after updating this file, you may need to restart the dev server
// docs: https://docs.basic.tech/info/schema 

export const schema = {
  "project_id": "c64278ad-7e9f-4fed-bf14-5af221796833",
  "tables": {
    "location": {
      "type": "collection",
      "fields": {
        "coordinates": {
          "type": "string",
          "indexed": true
        }
      }
    }
  },
  version: 1,
}
