# CAT FUD

A simple node app to expose a dumb rest api endpoint via a Beaglebone Black 
to control a PetMate feeder motor.

Application is in `node-app`. Would need a `npm install`.

BBB needs a startup script, and uses systemd, so we have two `*.service` files. 
They go in `/lib/systemd/system/` and are activated by `systemctl enable consul.service`
and then `systemctl start consul.service`.

Consul is there as my service discovery, health monintor system (some/all of this
is very env specific).

Health checks and agent config:

```
# cat /etc/consul.d/catfood.json
{
  "service": {
    "name": "catfood",
    "tags": ["catfood"],
    "port": 9090,
    "check": {
      "id": "catfood-alive",
      "name": "cfa",
      "http": "http://localhost:9090",
      "interval": "10s",
      "timeout": "1s"
    }
  }
}

# cat /etc/consul.d/ping.json
{
  "check": {
    "name": "ping", 
    "script": "ping -c1 google.com >/dev/null", 
    "interval": "30s"
  }
}

# cat /etc/consul.d/server.json
{
  "server": false,
  "start_join": [ "192.168.1.2" ],
  "data_dir": "/var/consul/data"
}
```
