# jQuery Google Custom Search Engine

A lightweight wrapper around Google's Custom Search Engine featuring a Bootstrap theme.

[![Build Status](https://travis-ci.org/abeMedia/jquery-gcse.svg?branch=master)](https://travis-ci.org/abeMedia/jquery-gcse)
[![Dependency Status](https://dependencyci.com/github/abeMedia/jquery-gcse/badge)](https://dependencyci.com/github/abeMedia/jquery-gcse)


## Usage

jQuery Google CSE needs to be activated via JavaScript.

```js
$('#search_results').gcse({cseKey: 'YOUR_CSE_KEY'});
```

### Options

| Name      | Type | Default | Description |
|-----------|------|---------|-------------|
| `cseKey` (required)  | string  |  | Your Google Custom Search Key |
| `adsenseId`  | string  |  | Your AdSense Publisher ID (for making cash with ads) |
| `site` | string |  | Search only URLs on this site (e.g. example.com/blog) |
| `param` | string | `q` | URL param holding search query |
| `autoComplete` | string | `true` | Enable auto-complete in the searchbox |
| `resultsOnly` | string | `false` | Hide the search box |
| `safe` | string | `false` | Enable safe-search - can be 'moderate', 'strict' or false |
| `language` | string | `en` | Specify a language for your search engine |


## Copyright

&copy; 2015-2016 Adam Bouqdib - http://abemedia.co.uk
