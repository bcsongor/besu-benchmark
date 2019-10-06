#!/usr/bin/env python3

import sys
import json
import urllib.request

argc = len(sys.argv) - 1

rpc_method = "eth_blockNumber"
rpc_params = []
rpc_endpoint = "http://localhost:8545"

if argc > 0: rpc_method = sys.argv[1].replace(".", "_")
if argc > 1: rpc_params = json.loads(sys.argv[2])
if argc > 2: rpc_endpoint = sys.argv[3]

rpc_call = {"jsonrpc": "2.0", "method": rpc_method, "params": rpc_params, "id": 1}

try:
    req = urllib.request.Request(rpc_endpoint,
            data=json.dumps(rpc_call).encode("utf-8"),
            headers={"content-type": "application/json"})
    with urllib.request.urlopen(req) as f:
        res = f.read()
        res_json = json.loads(res.decode())
        print(json.dumps(res_json["result"], indent=2))
except Exception as e:
    print(e)
