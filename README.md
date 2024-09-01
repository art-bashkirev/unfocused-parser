# Unfocused Journal Parser

## Table of Contents

1. [Unfocused Journal Parser](#unfocused-journal-parser)
2. [Features](#features)
3. [Usage](#usage)
   - [Install Dependencies](#install-dependencies)
   - [Run the Parser Locally](#run-the-parser-locally)
   - [Send a Request](#send-a-request)
4. [Notes](#notes)
5. [Deployment](#deployment)
   - [Create a Cloud Function](#create-a-cloud-function)
   - [Deploy to Cloud Function](#deploy-to-cloud-function)
   - [Invoke the Function](#invoke-the-function)
6. [Example Request Body](#example-request-body)
7. [Example Response Body](#example-response-body)
8. [TODO](#todo)

## Unfocused Journal Parser

This project provides a cloud function that parses a markdown journal file and extracts its entries into a structured JSON format.

## Features

- Parses markdown content to extract journal entries.
- Identifies date, time, and content for each entry.
- Handles nested markdown elements (e.g., code blocks, emphasis).

## Usage

1. **Install Dependencies:**

   - `npm install`

2. **Run the Parser Locally:**

   - `npm run dev`
   - This will start a local server that listens on port 8787.

3. **Send a Request:**

   - Set the request method to POST.
   - Set the request body to the journal markdown content.
   - Set the request header `Content-Type` to `text/plain`.
   - Send the request to `http://localhost:8787/`.

   | Header          | Description             |
   | --------------- | ----------------------- |
   | `Content-Type`  | `text/plain`            |
   | `Accept`        | `application/json`      |
   | `Authorization` | `Bearer <your-api-key>` |

## Notes

- The parser assumes a specific format for journal entries.
- The output JSON structure can be customized as needed.
- The cloud function can be deployed to any cloud provider that supports serverless functions.

## Deployment

1. **Create a Cloud Function:**

   - Choose your preferred cloud function provider (Wrangler - Cloudflare Workers).
   - Create a new cloud function.

2. **Deploy to Cloud Function:**

   - Configure the cloud function provider (Wrangler - Cloudflare Workers).
   - `npm run deploy`

3. **Invoke the Function:**
   - Send a POST request to the deployed cloud function endpoint with the journal markdown content in the request body.

## Example Request Body

````markdown
# Hello, World!

## Aug 17, 2024

### 12:43 AM

Why?

## Aug 18, 2042

### 01:42 AM

I still don't know...

Why?

## Aug 19, 2042

_This_ is important!

### 07:12 PM

```markdown
this is not as important
```
````

## Example Response Body

```json
[
 {
  "time": "2024-08-17T00:43:00.000+03:00",
  "html": "<p>Why?</p>\n"
 },
 {
  "time": "2042-08-18T01:42:00.000+03:00",
  "html": "<p>I still don't know...</p>\n<p>Why?</p>\n"
 },
 {
  "time": "2042-08-19T00:00:00.000+03:00",
  "type": "onlyDate",
  "html": "<p><em>This</em> is important!</p>\n"
 },
 {
  "time": "2042-08-19T19:12:00.000+03:00",
  "html": "<pre><code class=\"language-markdown\">this is not as important\n</code></pre>\n"
 }
]
```

## TODO

- [ ] Add support for different journal entry formats.
- [ ] Implement error handling and logging.
- [ ] Add unit tests.
- [ ] Improve performance and scalability.
- [ ] Add support for different cloud function providers.
- [ ] Add support for different markdown parsing libraries.
- [ ] Add support for different output formats (e.g., CSV, XML).
- [ ] Add support for different languages.
- [ ] Add support for different time zones.
- [ ] Add support for different date formats.
- [ ] Add support for different file formats (e.g., txt, md).
