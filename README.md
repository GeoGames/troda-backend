Troda Backend
=============

## API

| Endpoint | GET | POST |
|----------|-----|------|
| /api/troda/ | List all Trodas | Add new Troda |
| /api/troda/`id`/ | Get Troda | |
| /api/troda/`id`/challenge/ | Get challenges | Add new challenge |
| /api/troda/`id`/challenge/`id`/found | Who found it | Add new found |
| /apo/finn/`type` | Get results | |

## Objects

### Troda

```json
{
  "_id": "52f5f8742d16451b26b70ded",
  "name": "My Troda"
}
```

### Challenge

```json
{
  "_id": "52f5f8f82d16451b26b70def",
  "troda": "52f5f8742d16451b26b70ded",
  "type": "SSR",
  "id": 12345,
  "geojson": {"type": "Point", "coordiantes": [1,2]}
}
```

### Found

```json
{
  "_id": "52f5f99e2d16451b26b70df4",
  "troda": "52f5f8742d16451b26b70ded",
  "challenge": "52f5f8f82d16451b26b70def",
  "user": {"id": 123, "name": "My Name"},
  "datestamp": 1391853979048
}
```

## Finn

### Kulturminner

* GET /api/finn/kulturminner?navn=`String`
* GET /api/finn/kulturminner?bbox=`x1`,`y1`,`x2`,`y2`

### Fjelltopper

* GET /api/finn/fjelltopper?navn=`String`
* GET /api/finn/fjelltopper?bbox=`x1`,`y1`,`x2`,`y2`

### SSR

* GET /api/finn/ssr?navn=`String`

### Hytter

* GET /api/finn/hytter?bbox=`x1`,`y1`,`x2`,`y2`

