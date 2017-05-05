define({ "api": [
  {
    "type": "post",
    "url": "/musics",
    "title": "Create Music",
    "name": "CreateMusic",
    "group": "Music",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Music Name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "year",
            "description": "<p>Year OF release</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request Exmaple",
          "content": "{\n \n  \"name\":  \"music1\",\n  \"year\":   \"1970\"\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n\"_id\": \"58af8cbd7544b94c8fa864e7\",\n \"name\": \"Chelsea\",\n\"Year\": \"1978\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/music.js",
    "groupTitle": "Music"
  },
  {
    "type": "get",
    "url": "/musics",
    "title": "Get Music Collections",
    "name": "Get_Music_Collections",
    "group": "Music",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[ \n{\n\"_id\": \"58af8cbd7544b94c8fa864e7\",\n \"name\": \"music1\",\n\"Year\": \"1978\",\n\"thumbnail\":\"images/artistx.png\",\n\"path\":\"musics/music.mp3\",\n\"status\":\"enable\"\n}\n{\n\"_id\": \"58af8cbd7544b94c8fa864e7\",\n \"name\": \"music1\",\n\"Year\": \"1978\",\n\"thumbnail\":\"images/artistx.png\",\n\"path\":\"musics/music.mp3\",\n\"status\":\"enable\"\n}\n{\n\"_id\": \"58af8cbd7544b94c8fa864e7\",\n \"name\": \"music1\",\n\"Year\": \"1978\",\n\"thumbnail\":\"images/artistx.png\",\n\"path\":\"musics/music.mp3\",\n\"status\":\"enable\"\n}\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/music.js",
    "groupTitle": "Music"
  },
  {
    "type": "post",
    "url": "/musics/:id",
    "title": "Uplaod Music",
    "name": "Upload_Music",
    "group": "Music",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "file",
            "optional": false,
            "field": "music",
            "description": "<p>field Name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>music ID</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n\"_id\": \"58af8cbd7544b94c8fa864e7\",\n \"name\": \"musicq\",\n\"Year\": \"1978\",\n\"path\":\"musics/music1.mp3\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/music.js",
    "groupTitle": "Music"
  }
] });
