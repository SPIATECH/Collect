---
title: LoopBack Application
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - javascript--nodejs: Node.JS
  - ruby: Ruby
  - python: Python
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: false
highlight_theme: darkula
headingLevel: 2

---

<h1 id="loopback-application">LoopBack Application v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Base URLs:

* <a href="http://127.0.0.1:3000">http://127.0.0.1:3000</a>

<h1 id="loopback-application-alertcontroller">AlertController</h1>

## AlertController.count

<a id="opIdAlertController.count"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/alerts/count \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/alerts/count HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/alerts/count',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/alerts/count',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/alerts/count',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/alerts/count', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/alerts/count");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/alerts/count", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /alerts/count`

<h3 id="alertcontroller.count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="alertcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Alert model count|Inline|

<h3 id="alertcontroller.count-responseschema">Response Schema</h3>

Status Code **200**

*loopback.count*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## AlertController.replaceById

<a id="opIdAlertController.replaceById"></a>

> Code samples

```shell
# You can also use wget
curl -X PUT http://127.0.0.1:3000/alerts/{id} \
  -H 'Content-Type: application/json'

```

```http
PUT http://127.0.0.1:3000/alerts/{id} HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/alerts/{id}',
  method: 'put',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "enabled": true,
  "id": "string",
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}';
const headers = {
  'Content-Type':'application/json'

};

fetch('http://127.0.0.1:3000/alerts/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.put 'http://127.0.0.1:3000/alerts/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.put('http://127.0.0.1:3000/alerts/{id}', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/alerts/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://127.0.0.1:3000/alerts/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /alerts/{id}`

> Body parameter

```json
{
  "enabled": true,
  "id": "string",
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}
```

<h3 id="alertcontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Alert](#schemaalert)|false|none|

<h3 id="alertcontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Alert PUT success|None|

<aside class="success">
This operation does not require authentication
</aside>

## AlertController.updateById

<a id="opIdAlertController.updateById"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH http://127.0.0.1:3000/alerts/{id} \
  -H 'Content-Type: application/json'

```

```http
PATCH http://127.0.0.1:3000/alerts/{id} HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/alerts/{id}',
  method: 'patch',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "enabled": true,
  "id": "string",
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}';
const headers = {
  'Content-Type':'application/json'

};

fetch('http://127.0.0.1:3000/alerts/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.patch 'http://127.0.0.1:3000/alerts/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.patch('http://127.0.0.1:3000/alerts/{id}', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/alerts/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://127.0.0.1:3000/alerts/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /alerts/{id}`

> Body parameter

```json
{
  "enabled": true,
  "id": "string",
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}
```

<h3 id="alertcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[AlertPartial](#schemaalertpartial)|false|none|

<h3 id="alertcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Alert PATCH success|None|

<aside class="success">
This operation does not require authentication
</aside>

## AlertController.findById

<a id="opIdAlertController.findById"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/alerts/{id} \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/alerts/{id} HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/alerts/{id}',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/alerts/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/alerts/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/alerts/{id}', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/alerts/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/alerts/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /alerts/{id}`

<h3 id="alertcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "enabled": true,
  "id": "string",
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string",
  "tag": {
    "id": "string",
    "name": "string",
    "device": "string",
    "tagGroupId": "string",
    "tagGroup": {
      "name": "string",
      "id": "string",
      "parentId": "string",
      "subgroups": [
        null
      ]
    },
    "alerts": [
      null
    ]
  },
  "notifications": [
    {
      "id": "string",
      "name": "string",
      "email": [
        {}
      ],
      "sms": [
        {}
      ],
      "alertId": "string",
      "alert": null
    }
  ]
}
```

<h3 id="alertcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Alert model instance|[AlertWithRelations](#schemaalertwithrelations)|

<aside class="success">
This operation does not require authentication
</aside>

## AlertController.deleteById

<a id="opIdAlertController.deleteById"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE http://127.0.0.1:3000/alerts/{id}

```

```http
DELETE http://127.0.0.1:3000/alerts/{id} HTTP/1.1
Host: 127.0.0.1:3000

```

```javascript

$.ajax({
  url: 'http://127.0.0.1:3000/alerts/{id}',
  method: 'delete',

  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

fetch('http://127.0.0.1:3000/alerts/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.delete 'http://127.0.0.1:3000/alerts/{id}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.delete('http://127.0.0.1:3000/alerts/{id}', params={

)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/alerts/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://127.0.0.1:3000/alerts/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /alerts/{id}`

<h3 id="alertcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="alertcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Alert DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## AlertController.create

<a id="opIdAlertController.create"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://127.0.0.1:3000/alerts \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST http://127.0.0.1:3000/alerts HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
Accept: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/alerts',
  method: 'post',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "enabled": true,
  "id": "string",
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/alerts',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'http://127.0.0.1:3000/alerts',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('http://127.0.0.1:3000/alerts', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/alerts");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://127.0.0.1:3000/alerts", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /alerts`

> Body parameter

```json
{
  "enabled": true,
  "id": "string",
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}
```

<h3 id="alertcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewAlert](#schemanewalert)|false|none|

> Example responses

> 200 Response

```json
{
  "enabled": true,
  "id": "string",
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}
```

<h3 id="alertcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Alert model instance|[Alert](#schemaalert)|

<aside class="success">
This operation does not require authentication
</aside>

## AlertController.updateAll

<a id="opIdAlertController.updateAll"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH http://127.0.0.1:3000/alerts \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
PATCH http://127.0.0.1:3000/alerts HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
Accept: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/alerts',
  method: 'patch',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "enabled": true,
  "id": "string",
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/alerts',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.patch 'http://127.0.0.1:3000/alerts',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.patch('http://127.0.0.1:3000/alerts', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/alerts");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://127.0.0.1:3000/alerts", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /alerts`

> Body parameter

```json
{
  "enabled": true,
  "id": "string",
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}
```

<h3 id="alertcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[AlertPartial](#schemaalertpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="alertcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Alert PATCH success count|Inline|

<h3 id="alertcontroller.updateall-responseschema">Response Schema</h3>

Status Code **200**

*loopback.count*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## AlertController.find

<a id="opIdAlertController.find"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/alerts \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/alerts HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/alerts',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/alerts',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/alerts',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/alerts', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/alerts");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/alerts", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /alerts`

<h3 id="alertcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|object|false|none|

> Example responses

> 200 Response

```json
[
  {
    "enabled": true,
    "id": "string",
    "type": "string",
    "period": 0,
    "alertgroup": "string",
    "user": "string",
    "deadbandvalue": "string",
    "activationdelay": 0,
    "metadata": {},
    "alerts": [
      {}
    ],
    "tagId": "string",
    "tag": {
      "id": "string",
      "name": "string",
      "device": "string",
      "tagGroupId": "string",
      "tagGroup": {
        "name": "string",
        "id": "string",
        "parentId": "string",
        "subgroups": [
          null
        ]
      },
      "alerts": [
        null
      ]
    },
    "notifications": [
      {
        "id": "string",
        "name": "string",
        "email": [
          {}
        ],
        "sms": [
          {}
        ],
        "alertId": "string",
        "alert": null
      }
    ]
  }
]
```

<h3 id="alertcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Alert model instances|Inline|

<h3 id="alertcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[AlertWithRelations](#schemaalertwithrelations)]|false|none|[(Schema options: { includeRelations: true })]|
|» AlertWithRelations|object|false|none|(Schema options: { includeRelations: true })|
|»» enabled|boolean|true|none|none|
|»» id|string|false|none|none|
|»» type|string|false|none|none|
|»» period|number|false|none|none|
|»» alertgroup|string|false|none|none|
|»» user|string|false|none|none|
|»» deadbandvalue|string|false|none|none|
|»» activationdelay|number|false|none|none|
|»» metadata|object|false|none|none|
|»» alerts|[object]|false|none|none|
|»» tagId|string|false|none|none|
|»» tag|object|false|none|(Schema options: { includeRelations: true })|
|»»» id|string|true|none|none|
|»»» name|string|true|none|none|
|»»» device|string|false|none|none|
|»»» tagGroupId|string|false|none|none|
|»»» tagGroup|object|false|none|(Schema options: { includeRelations: true })|
|»»»» name|string|true|none|none|
|»»»» id|string|true|none|none|
|»»»» parentId|string|false|none|none|
|»»»» subgroups|[[TagGroupWithRelations](#schemataggroupwithrelations)]|false|none|(Schema options: { includeRelations: true })|
|»»»»» TagGroupWithRelations|object|false|none|(Schema options: { includeRelations: true })|
|»»»» alerts|[[AlertWithRelations](#schemaalertwithrelations)]|false|none|(Schema options: { includeRelations: true })|
|»»»»» AlertWithRelations|object|false|none|(Schema options: { includeRelations: true })|
|»»»» notifications|[[NotificationWithRelations](#schemanotificationwithrelations)]|false|none|(Schema options: { includeRelations: true })|
|»»»»» NotificationWithRelations|object|false|none|(Schema options: { includeRelations: true })|
|»»»»»» id|string|false|none|none|
|»»»»»» name|string|true|none|none|
|»»»»»» email|[object]|false|none|none|
|»»»»»» sms|[object]|false|none|none|
|»»»»»» alertId|string|false|none|none|
|»»»»»» alert|object|false|none|(Schema options: { includeRelations: true })|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="loopback-application-alertnotificationcontroller">AlertNotificationController</h1>

## AlertNotificationController.create

<a id="opIdAlertNotificationController.create"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://127.0.0.1:3000/alerts/{id}/notifications \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST http://127.0.0.1:3000/alerts/{id}/notifications HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
Accept: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/alerts/{id}/notifications',
  method: 'post',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/alerts/{id}/notifications',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'http://127.0.0.1:3000/alerts/{id}/notifications',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('http://127.0.0.1:3000/alerts/{id}/notifications', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/alerts/{id}/notifications");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://127.0.0.1:3000/alerts/{id}/notifications", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /alerts/{id}/notifications`

> Body parameter

```json
{
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}
```

<h3 id="alertnotificationcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewNotificationInAlert](#schemanewnotificationinalert)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}
```

<h3 id="alertnotificationcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Alert model instance|[Notification](#schemanotification)|

<aside class="success">
This operation does not require authentication
</aside>

## AlertNotificationController.patch

<a id="opIdAlertNotificationController.patch"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH http://127.0.0.1:3000/alerts/{id}/notifications \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
PATCH http://127.0.0.1:3000/alerts/{id}/notifications HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
Accept: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/alerts/{id}/notifications',
  method: 'patch',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "id": "string",
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/alerts/{id}/notifications',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.patch 'http://127.0.0.1:3000/alerts/{id}/notifications',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.patch('http://127.0.0.1:3000/alerts/{id}/notifications', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/alerts/{id}/notifications");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://127.0.0.1:3000/alerts/{id}/notifications", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /alerts/{id}/notifications`

> Body parameter

```json
{
  "id": "string",
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}
```

<h3 id="alertnotificationcontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|
|body|body|[NotificationPartial](#schemanotificationpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="alertnotificationcontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Alert.Notification PATCH success count|Inline|

<h3 id="alertnotificationcontroller.patch-responseschema">Response Schema</h3>

Status Code **200**

*loopback.count*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## AlertNotificationController.find

<a id="opIdAlertNotificationController.find"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/alerts/{id}/notifications \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/alerts/{id}/notifications HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/alerts/{id}/notifications',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/alerts/{id}/notifications',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/alerts/{id}/notifications',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/alerts/{id}/notifications', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/alerts/{id}/notifications");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/alerts/{id}/notifications", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /alerts/{id}/notifications`

<h3 id="alertnotificationcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|object|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "email": [
      {}
    ],
    "sms": [
      {}
    ],
    "alertId": "string"
  }
]
```

<h3 id="alertnotificationcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Notification's belonging to Alert|Inline|

<h3 id="alertnotificationcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Notification](#schemanotification)]|false|none|none|
|» Notification|object|false|none|none|
|»» id|string|false|none|none|
|»» name|string|true|none|none|
|»» email|[object]|false|none|none|
|»» sms|[object]|false|none|none|
|»» alertId|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## AlertNotificationController.delete

<a id="opIdAlertNotificationController.delete"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE http://127.0.0.1:3000/alerts/{id}/notifications \
  -H 'Accept: application/json'

```

```http
DELETE http://127.0.0.1:3000/alerts/{id}/notifications HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/alerts/{id}/notifications',
  method: 'delete',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/alerts/{id}/notifications',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.delete 'http://127.0.0.1:3000/alerts/{id}/notifications',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.delete('http://127.0.0.1:3000/alerts/{id}/notifications', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/alerts/{id}/notifications");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://127.0.0.1:3000/alerts/{id}/notifications", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /alerts/{id}/notifications`

<h3 id="alertnotificationcontroller.delete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="alertnotificationcontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Alert.Notification DELETE success count|Inline|

<h3 id="alertnotificationcontroller.delete-responseschema">Response Schema</h3>

Status Code **200**

*loopback.count*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="loopback-application-alerttagcontroller">AlertTagController</h1>

## AlertTagController.getTag

<a id="opIdAlertTagController.getTag"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/alerts/{id}/tag \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/alerts/{id}/tag HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/alerts/{id}/tag',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/alerts/{id}/tag',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/alerts/{id}/tag',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/alerts/{id}/tag', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/alerts/{id}/tag");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/alerts/{id}/tag", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /alerts/{id}/tag`

<h3 id="alerttagcontroller.gettag-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "device": "string",
    "tagGroupId": "string"
  }
]
```

<h3 id="alerttagcontroller.gettag-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tag belonging to Alert|Inline|

<h3 id="alerttagcontroller.gettag-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Tag](#schematag)]|false|none|none|
|» Tag|object|false|none|none|
|»» id|string|true|none|none|
|»» name|string|true|none|none|
|»» device|string|false|none|none|
|»» tagGroupId|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="loopback-application-notificationcontroller">NotificationController</h1>

## NotificationController.count

<a id="opIdNotificationController.count"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/notifications/count \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/notifications/count HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/notifications/count',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/notifications/count',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/notifications/count',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/notifications/count', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/notifications/count");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/notifications/count", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /notifications/count`

<h3 id="notificationcontroller.count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="notificationcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification model count|Inline|

<h3 id="notificationcontroller.count-responseschema">Response Schema</h3>

Status Code **200**

*loopback.count*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## NotificationController.replaceById

<a id="opIdNotificationController.replaceById"></a>

> Code samples

```shell
# You can also use wget
curl -X PUT http://127.0.0.1:3000/notifications/{id} \
  -H 'Content-Type: application/json'

```

```http
PUT http://127.0.0.1:3000/notifications/{id} HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/notifications/{id}',
  method: 'put',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "id": "string",
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}';
const headers = {
  'Content-Type':'application/json'

};

fetch('http://127.0.0.1:3000/notifications/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.put 'http://127.0.0.1:3000/notifications/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.put('http://127.0.0.1:3000/notifications/{id}', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/notifications/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://127.0.0.1:3000/notifications/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /notifications/{id}`

> Body parameter

```json
{
  "id": "string",
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}
```

<h3 id="notificationcontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Notification](#schemanotification)|false|none|

<h3 id="notificationcontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Notification PUT success|None|

<aside class="success">
This operation does not require authentication
</aside>

## NotificationController.updateById

<a id="opIdNotificationController.updateById"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH http://127.0.0.1:3000/notifications/{id} \
  -H 'Content-Type: application/json'

```

```http
PATCH http://127.0.0.1:3000/notifications/{id} HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/notifications/{id}',
  method: 'patch',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "id": "string",
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}';
const headers = {
  'Content-Type':'application/json'

};

fetch('http://127.0.0.1:3000/notifications/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.patch 'http://127.0.0.1:3000/notifications/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.patch('http://127.0.0.1:3000/notifications/{id}', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/notifications/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://127.0.0.1:3000/notifications/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /notifications/{id}`

> Body parameter

```json
{
  "id": "string",
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}
```

<h3 id="notificationcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NotificationPartial](#schemanotificationpartial)|false|none|

<h3 id="notificationcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Notification PATCH success|None|

<aside class="success">
This operation does not require authentication
</aside>

## NotificationController.findById

<a id="opIdNotificationController.findById"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/notifications/{id} \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/notifications/{id} HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/notifications/{id}',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/notifications/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/notifications/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/notifications/{id}', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/notifications/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/notifications/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /notifications/{id}`

<h3 id="notificationcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string",
  "alert": {
    "enabled": true,
    "id": "string",
    "type": "string",
    "period": 0,
    "alertgroup": "string",
    "user": "string",
    "deadbandvalue": "string",
    "activationdelay": 0,
    "metadata": {},
    "alerts": [
      {}
    ],
    "tagId": "string",
    "tag": {
      "id": "string",
      "name": "string",
      "device": "string",
      "tagGroupId": "string",
      "tagGroup": {
        "name": "string",
        "id": "string",
        "parentId": "string",
        "subgroups": [
          null
        ]
      },
      "alerts": [
        null
      ]
    },
    "notifications": [
      null
    ]
  }
}
```

<h3 id="notificationcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification model instance|[NotificationWithRelations](#schemanotificationwithrelations)|

<aside class="success">
This operation does not require authentication
</aside>

## NotificationController.deleteById

<a id="opIdNotificationController.deleteById"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE http://127.0.0.1:3000/notifications/{id}

```

```http
DELETE http://127.0.0.1:3000/notifications/{id} HTTP/1.1
Host: 127.0.0.1:3000

```

```javascript

$.ajax({
  url: 'http://127.0.0.1:3000/notifications/{id}',
  method: 'delete',

  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

fetch('http://127.0.0.1:3000/notifications/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.delete 'http://127.0.0.1:3000/notifications/{id}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.delete('http://127.0.0.1:3000/notifications/{id}', params={

)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/notifications/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://127.0.0.1:3000/notifications/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /notifications/{id}`

<h3 id="notificationcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="notificationcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Notification DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## NotificationController.create

<a id="opIdNotificationController.create"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://127.0.0.1:3000/notifications \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST http://127.0.0.1:3000/notifications HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
Accept: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/notifications',
  method: 'post',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/notifications',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'http://127.0.0.1:3000/notifications',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('http://127.0.0.1:3000/notifications', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/notifications");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://127.0.0.1:3000/notifications", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /notifications`

> Body parameter

```json
{
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}
```

<h3 id="notificationcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewNotification](#schemanewnotification)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}
```

<h3 id="notificationcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification model instance|[Notification](#schemanotification)|

<aside class="success">
This operation does not require authentication
</aside>

## NotificationController.updateAll

<a id="opIdNotificationController.updateAll"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH http://127.0.0.1:3000/notifications \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
PATCH http://127.0.0.1:3000/notifications HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
Accept: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/notifications',
  method: 'patch',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "id": "string",
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/notifications',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.patch 'http://127.0.0.1:3000/notifications',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.patch('http://127.0.0.1:3000/notifications', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/notifications");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://127.0.0.1:3000/notifications", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /notifications`

> Body parameter

```json
{
  "id": "string",
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}
```

<h3 id="notificationcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[NotificationPartial](#schemanotificationpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="notificationcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification PATCH success count|Inline|

<h3 id="notificationcontroller.updateall-responseschema">Response Schema</h3>

Status Code **200**

*loopback.count*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## NotificationController.find

<a id="opIdNotificationController.find"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/notifications \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/notifications HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/notifications',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/notifications',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/notifications',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/notifications', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/notifications");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/notifications", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /notifications`

<h3 id="notificationcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|object|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "email": [
      {}
    ],
    "sms": [
      {}
    ],
    "alertId": "string",
    "alert": {
      "enabled": true,
      "id": "string",
      "type": "string",
      "period": 0,
      "alertgroup": "string",
      "user": "string",
      "deadbandvalue": "string",
      "activationdelay": 0,
      "metadata": {},
      "alerts": [
        {}
      ],
      "tagId": "string",
      "tag": {
        "id": "string",
        "name": "string",
        "device": "string",
        "tagGroupId": "string",
        "tagGroup": {
          "name": "string",
          "id": "string",
          "parentId": "string",
          "subgroups": [
            null
          ]
        },
        "alerts": [
          null
        ]
      },
      "notifications": [
        null
      ]
    }
  }
]
```

<h3 id="notificationcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Notification model instances|Inline|

<h3 id="notificationcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[NotificationWithRelations](#schemanotificationwithrelations)]|false|none|[(Schema options: { includeRelations: true })]|
|» NotificationWithRelations|object|false|none|(Schema options: { includeRelations: true })|
|»» id|string|false|none|none|
|»» name|string|true|none|none|
|»» email|[object]|false|none|none|
|»» sms|[object]|false|none|none|
|»» alertId|string|false|none|none|
|»» alert|object|false|none|(Schema options: { includeRelations: true })|
|»»» enabled|boolean|true|none|none|
|»»» id|string|false|none|none|
|»»» type|string|false|none|none|
|»»» period|number|false|none|none|
|»»» alertgroup|string|false|none|none|
|»»» user|string|false|none|none|
|»»» deadbandvalue|string|false|none|none|
|»»» activationdelay|number|false|none|none|
|»»» metadata|object|false|none|none|
|»»» alerts|[object]|false|none|none|
|»»» tagId|string|false|none|none|
|»»» tag|object|false|none|(Schema options: { includeRelations: true })|
|»»»» id|string|true|none|none|
|»»»» name|string|true|none|none|
|»»»» device|string|false|none|none|
|»»»» tagGroupId|string|false|none|none|
|»»»» tagGroup|object|false|none|(Schema options: { includeRelations: true })|
|»»»»» name|string|true|none|none|
|»»»»» id|string|true|none|none|
|»»»»» parentId|string|false|none|none|
|»»»»» subgroups|[[TagGroupWithRelations](#schemataggroupwithrelations)]|false|none|(Schema options: { includeRelations: true })|
|»»»»»» TagGroupWithRelations|object|false|none|(Schema options: { includeRelations: true })|
|»»»»» alerts|[[AlertWithRelations](#schemaalertwithrelations)]|false|none|(Schema options: { includeRelations: true })|
|»»»»»» AlertWithRelations|object|false|none|(Schema options: { includeRelations: true })|
|»»»»» notifications|[[NotificationWithRelations](#schemanotificationwithrelations)]|false|none|(Schema options: { includeRelations: true })|
|»»»»»» NotificationWithRelations|object|false|none|(Schema options: { includeRelations: true })|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="loopback-application-notificationalertcontroller">NotificationAlertController</h1>

## NotificationAlertController.getAlert

<a id="opIdNotificationAlertController.getAlert"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/notifications/{id}/alert \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/notifications/{id}/alert HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/notifications/{id}/alert',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/notifications/{id}/alert',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/notifications/{id}/alert',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/notifications/{id}/alert', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/notifications/{id}/alert");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/notifications/{id}/alert", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /notifications/{id}/alert`

<h3 id="notificationalertcontroller.getalert-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
[
  {
    "enabled": true,
    "id": "string",
    "type": "string",
    "period": 0,
    "alertgroup": "string",
    "user": "string",
    "deadbandvalue": "string",
    "activationdelay": 0,
    "metadata": {},
    "alerts": [
      {}
    ],
    "tagId": "string"
  }
]
```

<h3 id="notificationalertcontroller.getalert-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Alert belonging to Notification|Inline|

<h3 id="notificationalertcontroller.getalert-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Alert](#schemaalert)]|false|none|none|
|» Alert|object|false|none|none|
|»» enabled|boolean|true|none|none|
|»» id|string|false|none|none|
|»» type|string|false|none|none|
|»» period|number|false|none|none|
|»» alertgroup|string|false|none|none|
|»» user|string|false|none|none|
|»» deadbandvalue|string|false|none|none|
|»» activationdelay|number|false|none|none|
|»» metadata|object|false|none|none|
|»» alerts|[object]|false|none|none|
|»» tagId|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="loopback-application-taggroupcontroller">TagGroupController</h1>

## TagGroupController.count

<a id="opIdTagGroupController.count"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/tag-groups/count \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/tag-groups/count HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tag-groups/count',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tag-groups/count',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/tag-groups/count',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/tag-groups/count', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tag-groups/count");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/tag-groups/count", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /tag-groups/count`

<h3 id="taggroupcontroller.count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="taggroupcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|TagGroup model count|Inline|

<h3 id="taggroupcontroller.count-responseschema">Response Schema</h3>

Status Code **200**

*loopback.count*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## TagGroupController.findTagsByGroupId

<a id="opIdTagGroupController.findTagsByGroupId"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/tag-groups/{id}/tags \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/tag-groups/{id}/tags HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tag-groups/{id}/tags',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tag-groups/{id}/tags',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/tag-groups/{id}/tags',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/tag-groups/{id}/tags', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tag-groups/{id}/tags");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/tag-groups/{id}/tags", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /tag-groups/{id}/tags`

<h3 id="taggroupcontroller.findtagsbygroupid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "device": "string",
    "tagGroupId": "string",
    "tagGroup": {
      "name": "string",
      "id": "string",
      "parentId": "string",
      "subgroups": [
        null
      ]
    },
    "alerts": [
      {
        "enabled": true,
        "id": "string",
        "type": "string",
        "period": 0,
        "alertgroup": "string",
        "user": "string",
        "deadbandvalue": "string",
        "activationdelay": 0,
        "metadata": {},
        "alerts": [
          {}
        ],
        "tagId": "string",
        "tag": null,
        "notifications": [
          {
            "id": "string",
            "name": "string",
            "email": [
              {}
            ],
            "sms": [
              {}
            ],
            "alertId": "string",
            "alert": null
          }
        ]
      }
    ]
  }
]
```

<h3 id="taggroupcontroller.findtagsbygroupid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tags in a tag group|Inline|

<h3 id="taggroupcontroller.findtagsbygroupid-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[TagWithRelations](#schematagwithrelations)]|false|none|[(Schema options: { includeRelations: true })]|
|» TagWithRelations|object|false|none|(Schema options: { includeRelations: true })|
|»» id|string|true|none|none|
|»» name|string|true|none|none|
|»» device|string|false|none|none|
|»» tagGroupId|string|false|none|none|
|»» tagGroup|object|false|none|(Schema options: { includeRelations: true })|
|»»» name|string|true|none|none|
|»»» id|string|true|none|none|
|»»» parentId|string|false|none|none|
|»»» subgroups|[[TagGroupWithRelations](#schemataggroupwithrelations)]|false|none|(Schema options: { includeRelations: true })|
|»»»» TagGroupWithRelations|object|false|none|(Schema options: { includeRelations: true })|
|»»» alerts|[[AlertWithRelations](#schemaalertwithrelations)]|false|none|(Schema options: { includeRelations: true })|
|»»»» AlertWithRelations|object|false|none|(Schema options: { includeRelations: true })|
|»»»»» enabled|boolean|true|none|none|
|»»»»» id|string|false|none|none|
|»»»»» type|string|false|none|none|
|»»»»» period|number|false|none|none|
|»»»»» alertgroup|string|false|none|none|
|»»»»» user|string|false|none|none|
|»»»»» deadbandvalue|string|false|none|none|
|»»»»» activationdelay|number|false|none|none|
|»»»»» metadata|object|false|none|none|
|»»»»» alerts|[object]|false|none|none|
|»»»»» tagId|string|false|none|none|
|»»»»» tag|object|false|none|(Schema options: { includeRelations: true })|
|»»»»» notifications|[[NotificationWithRelations](#schemanotificationwithrelations)]|false|none|(Schema options: { includeRelations: true })|
|»»»»»» NotificationWithRelations|object|false|none|(Schema options: { includeRelations: true })|
|»»»»»»» id|string|false|none|none|
|»»»»»»» name|string|true|none|none|
|»»»»»»» email|[object]|false|none|none|
|»»»»»»» sms|[object]|false|none|none|
|»»»»»»» alertId|string|false|none|none|
|»»»»»»» alert|object|false|none|(Schema options: { includeRelations: true })|

<aside class="success">
This operation does not require authentication
</aside>

## TagGroupController.replaceById

<a id="opIdTagGroupController.replaceById"></a>

> Code samples

```shell
# You can also use wget
curl -X PUT http://127.0.0.1:3000/tag-groups/{id} \
  -H 'Content-Type: application/json'

```

```http
PUT http://127.0.0.1:3000/tag-groups/{id} HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tag-groups/{id}',
  method: 'put',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "name": "string",
  "id": "string",
  "parentId": "string"
}';
const headers = {
  'Content-Type':'application/json'

};

fetch('http://127.0.0.1:3000/tag-groups/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.put 'http://127.0.0.1:3000/tag-groups/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.put('http://127.0.0.1:3000/tag-groups/{id}', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tag-groups/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://127.0.0.1:3000/tag-groups/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /tag-groups/{id}`

> Body parameter

```json
{
  "name": "string",
  "id": "string",
  "parentId": "string"
}
```

<h3 id="taggroupcontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[TagGroup](#schemataggroup)|false|none|

<h3 id="taggroupcontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|TagGroup PUT success|None|

<aside class="success">
This operation does not require authentication
</aside>

## TagGroupController.updateById

<a id="opIdTagGroupController.updateById"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH http://127.0.0.1:3000/tag-groups/{id} \
  -H 'Content-Type: application/json'

```

```http
PATCH http://127.0.0.1:3000/tag-groups/{id} HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tag-groups/{id}',
  method: 'patch',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "name": "string",
  "id": "string",
  "parentId": "string"
}';
const headers = {
  'Content-Type':'application/json'

};

fetch('http://127.0.0.1:3000/tag-groups/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.patch 'http://127.0.0.1:3000/tag-groups/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.patch('http://127.0.0.1:3000/tag-groups/{id}', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tag-groups/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://127.0.0.1:3000/tag-groups/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /tag-groups/{id}`

> Body parameter

```json
{
  "name": "string",
  "id": "string",
  "parentId": "string"
}
```

<h3 id="taggroupcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[TagGroupPartial](#schemataggrouppartial)|false|none|

<h3 id="taggroupcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|TagGroup PATCH success|None|

<aside class="success">
This operation does not require authentication
</aside>

## TagGroupController.findById

<a id="opIdTagGroupController.findById"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/tag-groups/{id} \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/tag-groups/{id} HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tag-groups/{id}',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tag-groups/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/tag-groups/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/tag-groups/{id}', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tag-groups/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/tag-groups/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /tag-groups/{id}`

<h3 id="taggroupcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "name": "string",
  "id": "string",
  "parentId": "string",
  "subgroups": [
    null
  ]
}
```

<h3 id="taggroupcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|TagGroup model instance|[TagGroupWithRelations](#schemataggroupwithrelations)|

<aside class="success">
This operation does not require authentication
</aside>

## TagGroupController.deleteById

<a id="opIdTagGroupController.deleteById"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE http://127.0.0.1:3000/tag-groups/{id}

```

```http
DELETE http://127.0.0.1:3000/tag-groups/{id} HTTP/1.1
Host: 127.0.0.1:3000

```

```javascript

$.ajax({
  url: 'http://127.0.0.1:3000/tag-groups/{id}',
  method: 'delete',

  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

fetch('http://127.0.0.1:3000/tag-groups/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.delete 'http://127.0.0.1:3000/tag-groups/{id}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.delete('http://127.0.0.1:3000/tag-groups/{id}', params={

)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tag-groups/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://127.0.0.1:3000/tag-groups/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /tag-groups/{id}`

<h3 id="taggroupcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="taggroupcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|TagGroup DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## TagGroupController.create

<a id="opIdTagGroupController.create"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://127.0.0.1:3000/tag-groups \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST http://127.0.0.1:3000/tag-groups HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
Accept: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tag-groups',
  method: 'post',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "name": "string",
  "id": "string",
  "parentId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tag-groups',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'http://127.0.0.1:3000/tag-groups',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('http://127.0.0.1:3000/tag-groups', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tag-groups");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://127.0.0.1:3000/tag-groups", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /tag-groups`

> Body parameter

```json
{
  "name": "string",
  "id": "string",
  "parentId": "string"
}
```

<h3 id="taggroupcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewTagGroup](#schemanewtaggroup)|false|none|

> Example responses

> 200 Response

```json
{
  "name": "string",
  "id": "string",
  "parentId": "string"
}
```

<h3 id="taggroupcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|TagGroup model instance|[TagGroup](#schemataggroup)|

<aside class="success">
This operation does not require authentication
</aside>

## TagGroupController.updateAll

<a id="opIdTagGroupController.updateAll"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH http://127.0.0.1:3000/tag-groups \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
PATCH http://127.0.0.1:3000/tag-groups HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
Accept: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tag-groups',
  method: 'patch',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "name": "string",
  "id": "string",
  "parentId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tag-groups',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.patch 'http://127.0.0.1:3000/tag-groups',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.patch('http://127.0.0.1:3000/tag-groups', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tag-groups");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://127.0.0.1:3000/tag-groups", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /tag-groups`

> Body parameter

```json
{
  "name": "string",
  "id": "string",
  "parentId": "string"
}
```

<h3 id="taggroupcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[TagGroupPartial](#schemataggrouppartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="taggroupcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|TagGroup PATCH success count|Inline|

<h3 id="taggroupcontroller.updateall-responseschema">Response Schema</h3>

Status Code **200**

*loopback.count*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## TagGroupController.find

<a id="opIdTagGroupController.find"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/tag-groups \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/tag-groups HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tag-groups',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tag-groups',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/tag-groups',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/tag-groups', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tag-groups");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/tag-groups", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /tag-groups`

<h3 id="taggroupcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|object|false|none|

> Example responses

> 200 Response

```json
[
  {
    "name": "string",
    "id": "string",
    "parentId": "string",
    "subgroups": [
      null
    ]
  }
]
```

<h3 id="taggroupcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of TagGroup model instances|Inline|

<h3 id="taggroupcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[TagGroupWithRelations](#schemataggroupwithrelations)]|false|none|[(Schema options: { includeRelations: true })]|
|» TagGroupWithRelations|object|false|none|(Schema options: { includeRelations: true })|
|»» name|string|true|none|none|
|»» id|string|true|none|none|
|»» parentId|string|false|none|none|
|»» subgroups|[[TagGroupWithRelations](#schemataggroupwithrelations)]|false|none|(Schema options: { includeRelations: true })|
|»»» TagGroupWithRelations|object|false|none|(Schema options: { includeRelations: true })|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="loopback-application-taggrouptaggroupcontroller">TagGroupTagGroupController</h1>

## TagGroupTagGroupController.create

<a id="opIdTagGroupTagGroupController.create"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://127.0.0.1:3000/tag-groups/{id}/tag-groups \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST http://127.0.0.1:3000/tag-groups/{id}/tag-groups HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
Accept: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tag-groups/{id}/tag-groups',
  method: 'post',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "name": "string",
  "parentId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tag-groups/{id}/tag-groups',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'http://127.0.0.1:3000/tag-groups/{id}/tag-groups',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('http://127.0.0.1:3000/tag-groups/{id}/tag-groups', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tag-groups/{id}/tag-groups");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://127.0.0.1:3000/tag-groups/{id}/tag-groups", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /tag-groups/{id}/tag-groups`

> Body parameter

```json
{
  "name": "string",
  "parentId": "string"
}
```

<h3 id="taggrouptaggroupcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewTagGroupInTagGroup](#schemanewtaggroupintaggroup)|false|none|

> Example responses

> 200 Response

```json
{
  "name": "string",
  "id": "string",
  "parentId": "string"
}
```

<h3 id="taggrouptaggroupcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|TagGroup model instance|[TagGroup](#schemataggroup)|

<aside class="success">
This operation does not require authentication
</aside>

## TagGroupTagGroupController.patch

<a id="opIdTagGroupTagGroupController.patch"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH http://127.0.0.1:3000/tag-groups/{id}/tag-groups \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
PATCH http://127.0.0.1:3000/tag-groups/{id}/tag-groups HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
Accept: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tag-groups/{id}/tag-groups',
  method: 'patch',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "name": "string",
  "id": "string",
  "parentId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tag-groups/{id}/tag-groups',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.patch 'http://127.0.0.1:3000/tag-groups/{id}/tag-groups',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.patch('http://127.0.0.1:3000/tag-groups/{id}/tag-groups', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tag-groups/{id}/tag-groups");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://127.0.0.1:3000/tag-groups/{id}/tag-groups", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /tag-groups/{id}/tag-groups`

> Body parameter

```json
{
  "name": "string",
  "id": "string",
  "parentId": "string"
}
```

<h3 id="taggrouptaggroupcontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|
|body|body|[TagGroupPartial](#schemataggrouppartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="taggrouptaggroupcontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|TagGroup.TagGroup PATCH success count|Inline|

<h3 id="taggrouptaggroupcontroller.patch-responseschema">Response Schema</h3>

Status Code **200**

*loopback.count*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## TagGroupTagGroupController.find

<a id="opIdTagGroupTagGroupController.find"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/tag-groups/{id}/tag-groups \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/tag-groups/{id}/tag-groups HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tag-groups/{id}/tag-groups',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tag-groups/{id}/tag-groups',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/tag-groups/{id}/tag-groups',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/tag-groups/{id}/tag-groups', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tag-groups/{id}/tag-groups");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/tag-groups/{id}/tag-groups", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /tag-groups/{id}/tag-groups`

<h3 id="taggrouptaggroupcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|object|false|none|

> Example responses

> 200 Response

```json
[
  {
    "name": "string",
    "id": "string",
    "parentId": "string"
  }
]
```

<h3 id="taggrouptaggroupcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of TagGroup's belonging to TagGroup|Inline|

<h3 id="taggrouptaggroupcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[TagGroup](#schemataggroup)]|false|none|none|
|» TagGroup|object|false|none|none|
|»» name|string|true|none|none|
|»» id|string|true|none|none|
|»» parentId|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## TagGroupTagGroupController.delete

<a id="opIdTagGroupTagGroupController.delete"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE http://127.0.0.1:3000/tag-groups/{id}/tag-groups \
  -H 'Accept: application/json'

```

```http
DELETE http://127.0.0.1:3000/tag-groups/{id}/tag-groups HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tag-groups/{id}/tag-groups',
  method: 'delete',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tag-groups/{id}/tag-groups',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.delete 'http://127.0.0.1:3000/tag-groups/{id}/tag-groups',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.delete('http://127.0.0.1:3000/tag-groups/{id}/tag-groups', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tag-groups/{id}/tag-groups");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://127.0.0.1:3000/tag-groups/{id}/tag-groups", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /tag-groups/{id}/tag-groups`

<h3 id="taggrouptaggroupcontroller.delete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="taggrouptaggroupcontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|TagGroup.TagGroup DELETE success count|Inline|

<h3 id="taggrouptaggroupcontroller.delete-responseschema">Response Schema</h3>

Status Code **200**

*loopback.count*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="loopback-application-tagcontroller">TagController</h1>

## TagController.count

<a id="opIdTagController.count"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/tags/count \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/tags/count HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tags/count',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tags/count',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/tags/count',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/tags/count', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tags/count");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/tags/count", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /tags/count`

<h3 id="tagcontroller.count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="tagcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tag model count|Inline|

<h3 id="tagcontroller.count-responseschema">Response Schema</h3>

Status Code **200**

*loopback.count*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## TagController.replaceById

<a id="opIdTagController.replaceById"></a>

> Code samples

```shell
# You can also use wget
curl -X PUT http://127.0.0.1:3000/tags/{id} \
  -H 'Content-Type: application/json'

```

```http
PUT http://127.0.0.1:3000/tags/{id} HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tags/{id}',
  method: 'put',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "id": "string",
  "name": "string",
  "device": "string",
  "tagGroupId": "string"
}';
const headers = {
  'Content-Type':'application/json'

};

fetch('http://127.0.0.1:3000/tags/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.put 'http://127.0.0.1:3000/tags/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.put('http://127.0.0.1:3000/tags/{id}', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tags/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://127.0.0.1:3000/tags/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /tags/{id}`

> Body parameter

```json
{
  "id": "string",
  "name": "string",
  "device": "string",
  "tagGroupId": "string"
}
```

<h3 id="tagcontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Tag](#schematag)|false|none|

<h3 id="tagcontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Tag PUT success|None|

<aside class="success">
This operation does not require authentication
</aside>

## TagController.updateById

<a id="opIdTagController.updateById"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH http://127.0.0.1:3000/tags/{id} \
  -H 'Content-Type: application/json'

```

```http
PATCH http://127.0.0.1:3000/tags/{id} HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tags/{id}',
  method: 'patch',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "id": "string",
  "name": "string",
  "device": "string",
  "tagGroupId": "string"
}';
const headers = {
  'Content-Type':'application/json'

};

fetch('http://127.0.0.1:3000/tags/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.patch 'http://127.0.0.1:3000/tags/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.patch('http://127.0.0.1:3000/tags/{id}', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tags/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://127.0.0.1:3000/tags/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /tags/{id}`

> Body parameter

```json
{
  "id": "string",
  "name": "string",
  "device": "string",
  "tagGroupId": "string"
}
```

<h3 id="tagcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[TagPartial](#schematagpartial)|false|none|

<h3 id="tagcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Tag PATCH success|None|

<aside class="success">
This operation does not require authentication
</aside>

## TagController.findById

<a id="opIdTagController.findById"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/tags/{id} \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/tags/{id} HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tags/{id}',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tags/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/tags/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/tags/{id}', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tags/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/tags/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /tags/{id}`

<h3 id="tagcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "device": "string",
  "tagGroupId": "string",
  "tagGroup": {
    "name": "string",
    "id": "string",
    "parentId": "string",
    "subgroups": [
      null
    ]
  },
  "alerts": [
    {
      "enabled": true,
      "id": "string",
      "type": "string",
      "period": 0,
      "alertgroup": "string",
      "user": "string",
      "deadbandvalue": "string",
      "activationdelay": 0,
      "metadata": {},
      "alerts": [
        {}
      ],
      "tagId": "string",
      "tag": null,
      "notifications": [
        {
          "id": "string",
          "name": "string",
          "email": [
            {}
          ],
          "sms": [
            {}
          ],
          "alertId": "string",
          "alert": null
        }
      ]
    }
  ]
}
```

<h3 id="tagcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tag model instance|[TagWithRelations](#schematagwithrelations)|

<aside class="success">
This operation does not require authentication
</aside>

## TagController.deleteById

<a id="opIdTagController.deleteById"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE http://127.0.0.1:3000/tags/{id}

```

```http
DELETE http://127.0.0.1:3000/tags/{id} HTTP/1.1
Host: 127.0.0.1:3000

```

```javascript

$.ajax({
  url: 'http://127.0.0.1:3000/tags/{id}',
  method: 'delete',

  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

fetch('http://127.0.0.1:3000/tags/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.delete 'http://127.0.0.1:3000/tags/{id}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.delete('http://127.0.0.1:3000/tags/{id}', params={

)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tags/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://127.0.0.1:3000/tags/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /tags/{id}`

<h3 id="tagcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="tagcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Tag DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## TagController.create

<a id="opIdTagController.create"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://127.0.0.1:3000/tags \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST http://127.0.0.1:3000/tags HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
Accept: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tags',
  method: 'post',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "id": "string",
  "name": "string",
  "device": "string",
  "tagGroupId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tags',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'http://127.0.0.1:3000/tags',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('http://127.0.0.1:3000/tags', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tags");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://127.0.0.1:3000/tags", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /tags`

> Body parameter

```json
{
  "id": "string",
  "name": "string",
  "device": "string",
  "tagGroupId": "string"
}
```

<h3 id="tagcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewTag](#schemanewtag)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "device": "string",
  "tagGroupId": "string"
}
```

<h3 id="tagcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tag model instance|[Tag](#schematag)|

<aside class="success">
This operation does not require authentication
</aside>

## TagController.updateAll

<a id="opIdTagController.updateAll"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH http://127.0.0.1:3000/tags \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
PATCH http://127.0.0.1:3000/tags HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
Accept: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tags',
  method: 'patch',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "id": "string",
  "name": "string",
  "device": "string",
  "tagGroupId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tags',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.patch 'http://127.0.0.1:3000/tags',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.patch('http://127.0.0.1:3000/tags', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tags");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://127.0.0.1:3000/tags", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /tags`

> Body parameter

```json
{
  "id": "string",
  "name": "string",
  "device": "string",
  "tagGroupId": "string"
}
```

<h3 id="tagcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[TagPartial](#schematagpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="tagcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tag PATCH success count|Inline|

<h3 id="tagcontroller.updateall-responseschema">Response Schema</h3>

Status Code **200**

*loopback.count*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## TagController.find

<a id="opIdTagController.find"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/tags \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/tags HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tags',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tags',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/tags',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/tags', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tags");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/tags", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /tags`

<h3 id="tagcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|object|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "device": "string",
    "tagGroupId": "string",
    "tagGroup": {
      "name": "string",
      "id": "string",
      "parentId": "string",
      "subgroups": [
        null
      ]
    },
    "alerts": [
      {
        "enabled": true,
        "id": "string",
        "type": "string",
        "period": 0,
        "alertgroup": "string",
        "user": "string",
        "deadbandvalue": "string",
        "activationdelay": 0,
        "metadata": {},
        "alerts": [
          {}
        ],
        "tagId": "string",
        "tag": null,
        "notifications": [
          {
            "id": "string",
            "name": "string",
            "email": [
              {}
            ],
            "sms": [
              {}
            ],
            "alertId": "string",
            "alert": null
          }
        ]
      }
    ]
  }
]
```

<h3 id="tagcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Tag model instances|Inline|

<h3 id="tagcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[TagWithRelations](#schematagwithrelations)]|false|none|[(Schema options: { includeRelations: true })]|
|» TagWithRelations|object|false|none|(Schema options: { includeRelations: true })|
|»» id|string|true|none|none|
|»» name|string|true|none|none|
|»» device|string|false|none|none|
|»» tagGroupId|string|false|none|none|
|»» tagGroup|object|false|none|(Schema options: { includeRelations: true })|
|»»» name|string|true|none|none|
|»»» id|string|true|none|none|
|»»» parentId|string|false|none|none|
|»»» subgroups|[[TagGroupWithRelations](#schemataggroupwithrelations)]|false|none|(Schema options: { includeRelations: true })|
|»»»» TagGroupWithRelations|object|false|none|(Schema options: { includeRelations: true })|
|»»» alerts|[[AlertWithRelations](#schemaalertwithrelations)]|false|none|(Schema options: { includeRelations: true })|
|»»»» AlertWithRelations|object|false|none|(Schema options: { includeRelations: true })|
|»»»»» enabled|boolean|true|none|none|
|»»»»» id|string|false|none|none|
|»»»»» type|string|false|none|none|
|»»»»» period|number|false|none|none|
|»»»»» alertgroup|string|false|none|none|
|»»»»» user|string|false|none|none|
|»»»»» deadbandvalue|string|false|none|none|
|»»»»» activationdelay|number|false|none|none|
|»»»»» metadata|object|false|none|none|
|»»»»» alerts|[object]|false|none|none|
|»»»»» tagId|string|false|none|none|
|»»»»» tag|object|false|none|(Schema options: { includeRelations: true })|
|»»»»» notifications|[[NotificationWithRelations](#schemanotificationwithrelations)]|false|none|(Schema options: { includeRelations: true })|
|»»»»»» NotificationWithRelations|object|false|none|(Schema options: { includeRelations: true })|
|»»»»»»» id|string|false|none|none|
|»»»»»»» name|string|true|none|none|
|»»»»»»» email|[object]|false|none|none|
|»»»»»»» sms|[object]|false|none|none|
|»»»»»»» alertId|string|false|none|none|
|»»»»»»» alert|object|false|none|(Schema options: { includeRelations: true })|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="loopback-application-tagalertcontroller">TagAlertController</h1>

## TagAlertController.create

<a id="opIdTagAlertController.create"></a>

> Code samples

```shell
# You can also use wget
curl -X POST http://127.0.0.1:3000/tags/{id}/alerts \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST http://127.0.0.1:3000/tags/{id}/alerts HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
Accept: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tags/{id}/alerts',
  method: 'post',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "enabled": true,
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tags/{id}/alerts',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'http://127.0.0.1:3000/tags/{id}/alerts',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('http://127.0.0.1:3000/tags/{id}/alerts', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tags/{id}/alerts");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://127.0.0.1:3000/tags/{id}/alerts", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /tags/{id}/alerts`

> Body parameter

```json
{
  "enabled": true,
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}
```

<h3 id="tagalertcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewAlertInTag](#schemanewalertintag)|false|none|

> Example responses

> 200 Response

```json
{
  "enabled": true,
  "id": "string",
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}
```

<h3 id="tagalertcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tag model instance|[Alert](#schemaalert)|

<aside class="success">
This operation does not require authentication
</aside>

## TagAlertController.patch

<a id="opIdTagAlertController.patch"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH http://127.0.0.1:3000/tags/{id}/alerts \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
PATCH http://127.0.0.1:3000/tags/{id}/alerts HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
Accept: application/json

```

```javascript
var headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tags/{id}/alerts',
  method: 'patch',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = '{
  "enabled": true,
  "id": "string",
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tags/{id}/alerts',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.patch 'http://127.0.0.1:3000/tags/{id}/alerts',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.patch('http://127.0.0.1:3000/tags/{id}/alerts', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tags/{id}/alerts");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://127.0.0.1:3000/tags/{id}/alerts", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /tags/{id}/alerts`

> Body parameter

```json
{
  "enabled": true,
  "id": "string",
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}
```

<h3 id="tagalertcontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|
|body|body|[AlertPartial](#schemaalertpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="tagalertcontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tag.Alert PATCH success count|Inline|

<h3 id="tagalertcontroller.patch-responseschema">Response Schema</h3>

Status Code **200**

*loopback.count*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## TagAlertController.find

<a id="opIdTagAlertController.find"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/tags/{id}/alerts \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/tags/{id}/alerts HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tags/{id}/alerts',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tags/{id}/alerts',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/tags/{id}/alerts',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/tags/{id}/alerts', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tags/{id}/alerts");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/tags/{id}/alerts", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /tags/{id}/alerts`

<h3 id="tagalertcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|object|false|none|

> Example responses

> 200 Response

```json
[
  {
    "enabled": true,
    "id": "string",
    "type": "string",
    "period": 0,
    "alertgroup": "string",
    "user": "string",
    "deadbandvalue": "string",
    "activationdelay": 0,
    "metadata": {},
    "alerts": [
      {}
    ],
    "tagId": "string"
  }
]
```

<h3 id="tagalertcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Alert's belonging to Tag|Inline|

<h3 id="tagalertcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Alert](#schemaalert)]|false|none|none|
|» Alert|object|false|none|none|
|»» enabled|boolean|true|none|none|
|»» id|string|false|none|none|
|»» type|string|false|none|none|
|»» period|number|false|none|none|
|»» alertgroup|string|false|none|none|
|»» user|string|false|none|none|
|»» deadbandvalue|string|false|none|none|
|»» activationdelay|number|false|none|none|
|»» metadata|object|false|none|none|
|»» alerts|[object]|false|none|none|
|»» tagId|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## TagAlertController.delete

<a id="opIdTagAlertController.delete"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE http://127.0.0.1:3000/tags/{id}/alerts \
  -H 'Accept: application/json'

```

```http
DELETE http://127.0.0.1:3000/tags/{id}/alerts HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tags/{id}/alerts',
  method: 'delete',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tags/{id}/alerts',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.delete 'http://127.0.0.1:3000/tags/{id}/alerts',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.delete('http://127.0.0.1:3000/tags/{id}/alerts', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tags/{id}/alerts");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://127.0.0.1:3000/tags/{id}/alerts", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /tags/{id}/alerts`

<h3 id="tagalertcontroller.delete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="tagalertcontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tag.Alert DELETE success count|Inline|

<h3 id="tagalertcontroller.delete-responseschema">Response Schema</h3>

Status Code **200**

*loopback.count*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="loopback-application-tagtaggroupcontroller">TagTagGroupController</h1>

## TagTagGroupController.getTagGroup

<a id="opIdTagTagGroupController.getTagGroup"></a>

> Code samples

```shell
# You can also use wget
curl -X GET http://127.0.0.1:3000/tags/{id}/tag-group \
  -H 'Accept: application/json'

```

```http
GET http://127.0.0.1:3000/tags/{id}/tag-group HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json

```

```javascript
var headers = {
  'Accept':'application/json'

};

$.ajax({
  url: 'http://127.0.0.1:3000/tags/{id}/tag-group',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'

};

fetch('http://127.0.0.1:3000/tags/{id}/tag-group',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'http://127.0.0.1:3000/tags/{id}/tag-group',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('http://127.0.0.1:3000/tags/{id}/tag-group', params={

}, headers = headers)

print r.json()

```

```java
URL obj = new URL("http://127.0.0.1:3000/tags/{id}/tag-group");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://127.0.0.1:3000/tags/{id}/tag-group", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /tags/{id}/tag-group`

<h3 id="tagtaggroupcontroller.gettaggroup-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
[
  {
    "name": "string",
    "id": "string",
    "parentId": "string"
  }
]
```

<h3 id="tagtaggroupcontroller.gettaggroup-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|TagGroup belonging to Tag|Inline|

<h3 id="tagtaggroupcontroller.gettaggroup-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[TagGroup](#schemataggroup)]|false|none|none|
|» TagGroup|object|false|none|none|
|»» name|string|true|none|none|
|»» id|string|true|none|none|
|»» parentId|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocSnotification">Notification</h2>

<a id="schemanotification"></a>

```json
{
  "id": "string",
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}

```

*Notification*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|name|string|true|none|none|
|email|[object]|false|none|none|
|sms|[object]|false|none|none|
|alertId|string|false|none|none|

<h2 id="tocSnewnotificationinalert">NewNotificationInAlert</h2>

<a id="schemanewnotificationinalert"></a>

```json
{
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}

```

*NewNotificationInAlert*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|email|[object]|false|none|none|
|sms|[object]|false|none|none|
|alertId|string|false|none|none|

<h2 id="tocSnotificationpartial">NotificationPartial</h2>

<a id="schemanotificationpartial"></a>

```json
{
  "id": "string",
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}

```

*NotificationPartial*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|name|string|false|none|none|
|email|[object]|false|none|none|
|sms|[object]|false|none|none|
|alertId|string|false|none|none|

<h2 id="tocStag">Tag</h2>

<a id="schematag"></a>

```json
{
  "id": "string",
  "name": "string",
  "device": "string",
  "tagGroupId": "string"
}

```

*Tag*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|none|
|name|string|true|none|none|
|device|string|false|none|none|
|tagGroupId|string|false|none|none|

<h2 id="tocSalert">Alert</h2>

<a id="schemaalert"></a>

```json
{
  "enabled": true,
  "id": "string",
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}

```

*Alert*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|enabled|boolean|true|none|none|
|id|string|false|none|none|
|type|string|false|none|none|
|period|number|false|none|none|
|alertgroup|string|false|none|none|
|user|string|false|none|none|
|deadbandvalue|string|false|none|none|
|activationdelay|number|false|none|none|
|metadata|object|false|none|none|
|alerts|[object]|false|none|none|
|tagId|string|false|none|none|

<h2 id="tocSnewalert">NewAlert</h2>

<a id="schemanewalert"></a>

```json
{
  "enabled": true,
  "id": "string",
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}

```

*NewAlert*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|enabled|boolean|true|none|none|
|id|string|false|none|none|
|type|string|false|none|none|
|period|number|false|none|none|
|alertgroup|string|false|none|none|
|user|string|false|none|none|
|deadbandvalue|string|false|none|none|
|activationdelay|number|false|none|none|
|metadata|object|false|none|none|
|alerts|[object]|false|none|none|
|tagId|string|false|none|none|

<h2 id="tocStaggroupwithrelations">TagGroupWithRelations</h2>

<a id="schemataggroupwithrelations"></a>

```json
{
  "name": "string",
  "id": "string",
  "parentId": "string",
  "subgroups": [
    null
  ]
}

```

*TagGroupWithRelations*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|id|string|true|none|none|
|parentId|string|false|none|none|
|subgroups|[[TagGroupWithRelations](#schemataggroupwithrelations)]|false|none|[(Schema options: { includeRelations: true })]|

<h2 id="tocStagwithrelations">TagWithRelations</h2>

<a id="schematagwithrelations"></a>

```json
{
  "id": "string",
  "name": "string",
  "device": "string",
  "tagGroupId": "string",
  "tagGroup": {
    "name": "string",
    "id": "string",
    "parentId": "string",
    "subgroups": [
      null
    ]
  },
  "alerts": [
    {
      "enabled": true,
      "id": "string",
      "type": "string",
      "period": 0,
      "alertgroup": "string",
      "user": "string",
      "deadbandvalue": "string",
      "activationdelay": 0,
      "metadata": {},
      "alerts": [
        {}
      ],
      "tagId": "string",
      "tag": null,
      "notifications": [
        {
          "id": "string",
          "name": "string",
          "email": [
            {}
          ],
          "sms": [
            {}
          ],
          "alertId": "string",
          "alert": null
        }
      ]
    }
  ]
}

```

*TagWithRelations*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|none|
|name|string|true|none|none|
|device|string|false|none|none|
|tagGroupId|string|false|none|none|
|tagGroup|[TagGroupWithRelations](#schemataggroupwithrelations)|false|none|(Schema options: { includeRelations: true })|
|alerts|[[AlertWithRelations](#schemaalertwithrelations)]|false|none|[(Schema options: { includeRelations: true })]|

<h2 id="tocSnotificationwithrelations">NotificationWithRelations</h2>

<a id="schemanotificationwithrelations"></a>

```json
{
  "id": "string",
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string",
  "alert": {
    "enabled": true,
    "id": "string",
    "type": "string",
    "period": 0,
    "alertgroup": "string",
    "user": "string",
    "deadbandvalue": "string",
    "activationdelay": 0,
    "metadata": {},
    "alerts": [
      {}
    ],
    "tagId": "string",
    "tag": {
      "id": "string",
      "name": "string",
      "device": "string",
      "tagGroupId": "string",
      "tagGroup": {
        "name": "string",
        "id": "string",
        "parentId": "string",
        "subgroups": [
          null
        ]
      },
      "alerts": [
        null
      ]
    },
    "notifications": [
      null
    ]
  }
}

```

*NotificationWithRelations*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|name|string|true|none|none|
|email|[object]|false|none|none|
|sms|[object]|false|none|none|
|alertId|string|false|none|none|
|alert|[AlertWithRelations](#schemaalertwithrelations)|false|none|(Schema options: { includeRelations: true })|

<h2 id="tocSalertwithrelations">AlertWithRelations</h2>

<a id="schemaalertwithrelations"></a>

```json
{
  "enabled": true,
  "id": "string",
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string",
  "tag": {
    "id": "string",
    "name": "string",
    "device": "string",
    "tagGroupId": "string",
    "tagGroup": {
      "name": "string",
      "id": "string",
      "parentId": "string",
      "subgroups": [
        null
      ]
    },
    "alerts": [
      null
    ]
  },
  "notifications": [
    {
      "id": "string",
      "name": "string",
      "email": [
        {}
      ],
      "sms": [
        {}
      ],
      "alertId": "string",
      "alert": null
    }
  ]
}

```

*AlertWithRelations*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|enabled|boolean|true|none|none|
|id|string|false|none|none|
|type|string|false|none|none|
|period|number|false|none|none|
|alertgroup|string|false|none|none|
|user|string|false|none|none|
|deadbandvalue|string|false|none|none|
|activationdelay|number|false|none|none|
|metadata|object|false|none|none|
|alerts|[object]|false|none|none|
|tagId|string|false|none|none|
|tag|[TagWithRelations](#schematagwithrelations)|false|none|(Schema options: { includeRelations: true })|
|notifications|[[NotificationWithRelations](#schemanotificationwithrelations)]|false|none|[(Schema options: { includeRelations: true })]|

<h2 id="tocSalertpartial">AlertPartial</h2>

<a id="schemaalertpartial"></a>

```json
{
  "enabled": true,
  "id": "string",
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}

```

*AlertPartial*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|enabled|boolean|false|none|none|
|id|string|false|none|none|
|type|string|false|none|none|
|period|number|false|none|none|
|alertgroup|string|false|none|none|
|user|string|false|none|none|
|deadbandvalue|string|false|none|none|
|activationdelay|number|false|none|none|
|metadata|object|false|none|none|
|alerts|[object]|false|none|none|
|tagId|string|false|none|none|

<h2 id="tocSnewnotification">NewNotification</h2>

<a id="schemanewnotification"></a>

```json
{
  "name": "string",
  "email": [
    {}
  ],
  "sms": [
    {}
  ],
  "alertId": "string"
}

```

*NewNotification*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|email|[object]|false|none|none|
|sms|[object]|false|none|none|
|alertId|string|false|none|none|

<h2 id="tocSnewalertintag">NewAlertInTag</h2>

<a id="schemanewalertintag"></a>

```json
{
  "enabled": true,
  "type": "string",
  "period": 0,
  "alertgroup": "string",
  "user": "string",
  "deadbandvalue": "string",
  "activationdelay": 0,
  "metadata": {},
  "alerts": [
    {}
  ],
  "tagId": "string"
}

```

*NewAlertInTag*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|enabled|boolean|true|none|none|
|type|string|false|none|none|
|period|number|false|none|none|
|alertgroup|string|false|none|none|
|user|string|false|none|none|
|deadbandvalue|string|false|none|none|
|activationdelay|number|false|none|none|
|metadata|object|false|none|none|
|alerts|[object]|false|none|none|
|tagId|string|false|none|none|

<h2 id="tocStaggroup">TagGroup</h2>

<a id="schemataggroup"></a>

```json
{
  "name": "string",
  "id": "string",
  "parentId": "string"
}

```

*TagGroup*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|id|string|true|none|none|
|parentId|string|false|none|none|

<h2 id="tocSnewtaggroupintaggroup">NewTagGroupInTagGroup</h2>

<a id="schemanewtaggroupintaggroup"></a>

```json
{
  "name": "string",
  "parentId": "string"
}

```

*NewTagGroupInTagGroup*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|parentId|string|false|none|none|

<h2 id="tocStaggrouppartial">TagGroupPartial</h2>

<a id="schemataggrouppartial"></a>

```json
{
  "name": "string",
  "id": "string",
  "parentId": "string"
}

```

*TagGroupPartial*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|false|none|none|
|id|string|false|none|none|
|parentId|string|false|none|none|

<h2 id="tocSnewtaggroup">NewTagGroup</h2>

<a id="schemanewtaggroup"></a>

```json
{
  "name": "string",
  "id": "string",
  "parentId": "string"
}

```

*NewTagGroup*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|id|string|true|none|none|
|parentId|string|false|none|none|

<h2 id="tocSnewtag">NewTag</h2>

<a id="schemanewtag"></a>

```json
{
  "id": "string",
  "name": "string",
  "device": "string",
  "tagGroupId": "string"
}

```

*NewTag*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|none|
|name|string|true|none|none|
|device|string|false|none|none|
|tagGroupId|string|false|none|none|

<h2 id="tocStagpartial">TagPartial</h2>

<a id="schematagpartial"></a>

```json
{
  "id": "string",
  "name": "string",
  "device": "string",
  "tagGroupId": "string"
}

```

*TagPartial*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|name|string|false|none|none|
|device|string|false|none|none|
|tagGroupId|string|false|none|none|

