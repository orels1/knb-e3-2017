# Kanobu E3 2017
>All aboard the hype train!

## Deployment

### Things you need

- Node 7.10
- MongoDB

### How to launch

>**Before you go:** for a good measure create `data/knb_cred.json` with contents like this:
```
{
    "access_token": "test",
    "refresh_token": test
}
```

Set env vars: `CLIENT_ID`, `CLIENT_SECRET`, `KNB_LOGIN`, `KNB_PASS` (in supervisord conf. for example)

Finally

```
npm install

node server.js
```

That's it! Uses port 3000 by default. You can change it by setting an `E3_PORT` env var.

Custom mongo url can be set with `MONGO_URL` env var.

### Development

```
npm install --only=dev

npm run watch
```

Now you can dive into the development - everything will be rebuilt on the fly

### Change the rubric

You can change the target rubric by setting the `E3_RUBRIC` env var. Then remove everything from `articleitems`, `newsitems` and `bingos` collections and you're good to go

### Production build

```
npm run build:prod
```

Minifies everything

### Stopping the process

If used with supervisord - just stop the process with supervisorctl and remove everything from the `/etc/supervisord.conf`
