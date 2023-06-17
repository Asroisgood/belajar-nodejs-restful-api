# Address API Spec

## Create Address API

Endpoint : POST /api/contacts/:contactId/addresses

Headers :

- Authorization : token

Request Body :

```json
{
  "street": "Jl. Jalan",
  "city": "Kota",
  "province": "Provinsi",
  "country": "Negara",
  "postal_code": "Kode pos"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "street": "Jl. Jalan",
    "city": "Kota",
    "province": "Provinsi",
    "country": "Negara",
    "postal_code": "Kode pos"
  }
}
```

Response Body Error :

```json
{
  "errors": "Postal Code is required"
}
```

## Update Address API

Endpoint : PUT /api/contacts/:addressId/addresses

Headers :

- Authorization : token

Request Body :

```json
{
  "street": "Jl. Jalan",
  "city": "Kota",
  "province": "Provinsi",
  "country": "Negara",
  "postal_code": "Kode pos"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "street": "Jl. Jalan",
    "city": "Kota",
    "province": "Provinsi",
    "country": "Negara",
    "postal_code": "Kode pos"
  }
}
```

Response Body Error :

```json
{
  "errors": "Postal Code is required"
}
```

## Get Address API

Endpoint : GET /api/contacts/:contactId/addresses/:addressId

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "street": "Jl. Jalan",
    "city": "Kota",
    "province": "Provinsi",
    "country": "Negara",
    "postal_code": "Kode pos"
  }
}
```

Response Body Error :

```json
{
  "errors": "Address not found!"
}
```

## List Adresses API

Endpoint : GET /api/contacts/:contactId/addresses

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "street": "Jl. Jalan",
      "city": "Kota",
      "province": "Provinsi",
      "country": "Negara",
      "postal_code": "Kode pos"
    },
    {
      "id": 2,
      "street": "Jl. Jalan",
      "city": "Kota",
      "province": "Provinsi",
      "country": "Negara",
      "postal_code": "Kode pos"
    }
  ]
}
```

Response Body Error :

```json
{
  "erros": "contact is not found"
}
```

## Remove Address API

Endpoint : DELETE /api/contacts/:contactId/addresses/:addressId

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "address is not found"
}
```
