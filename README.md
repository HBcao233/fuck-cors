<h1 align="center">FUCK CORS</h1>
<p align="center">
  <a href="https://raw.githubusercontent.com/hbcao233/fuck-cors/main/LICENSE">
    <img src="https://img.shields.io/github/license/hbcao233/fuck-cors" alt="MIT License">
  </a>
  <img src="https://img.shields.io/badge/JavaScript-b?logo=javascript" alt="JavaScript">
</p>

## Usage

Suppose you need to fetch data from an API or stream a video from a site like `https://examplea.com/api` or `https://exampleb.com/path/to/video.mp4`, but you be fucked by **CORS issues**. 
Now, simply use:  
`https://fuck-cors.lolih.dpdns.org/api?upstream_host=examplea.com`  
or  
`https://fuck-cors.lolih.dpdns.org/path/to/video.mp4?upstream_host=exampleb.com`  
—and you’ll get what you need without the CORS headache.

Additionally, `fuck-cors` automatically strips request headers starting with `sec-` and `cf-` to help avoid request blocking.

---

## API

### Query Parameter
#### `upstream_host`
Specify the target host you want to proxy the request to.

#### `real_origin`
Override the `Origin` header in the actual outgoing request.  
This is typically restricted by web APIs when set directly from the browser.

#### `real_referer`
Override the `Referer` header in the actual outgoing request.  
This is also commonly restricted when attempted from browser-side code.

#### `Set-Header-<HeaderName>`
Override the `<HeaderName>` response header.
For example, `?Set-Header-Content-Disposition=attachment; filename="filename.jpg"` can help you download a picture.

`<HeaderName>` allow `/^[0-9a-zA-Z-_]+$/`

---

### Header
#### `upstream-host`
Same as the `upstream_host` query parameter.

#### `real-origin`
Same as the `real_origin` query parameter.

#### `real-referer`
Same as the `real_referer` query parameter.

#### `Set-Header-<HeaderName>`
Same as the `Set-Header-<HeaderName>` query parameter.
---

**Note:**  
You can use either query parameters or headers to configure the request—they achieve the same result.
