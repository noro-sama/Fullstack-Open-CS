```mermaid
sequenceDiagram;

    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: 201 {"message":"note created"}
    deactivate server

    Note right of browser: The browser uses the JavaScript code it fetched from the server to add new note

```
