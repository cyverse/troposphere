import allocationSources from "./allocationSources"

const api = {
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
        {
            "activity": null,
            "allocation_source": allocationSources[0],
            "end_date": null,
            "id": 4673,
            "identity": {
                "id": "2",
                "provider": 4,
                "url": "https://app.atmo.dev:8000/api/v2/identities/0ed4a4f1-7657-4c61-8bd5-a420fddc569b.json",
                "uuid": "0ed4a4f1-7657-4c61-8bd5-a420fddc569b"
            },
            "image": {
                "description": "Image with pre-installed iRODS 4.1 and 'isetup' script for easy generation of iRODS client environment for Wrangler at IU or TACC.\n\nCentOS 6.7\n\nSee the instructions for use here:\nhttps://iujetstream.atlassian.net/wiki/display/JWT/Using+Jetstream+to+access+Wrangler+data+collections+with+iRODS",
                "end_date": null,
                "icon": null,
                "id": 69,
                "name": "Wrangler iRODS -- CentOS 6.7",
                "start_date": "2016-04-07T17:28:06.204294Z",
                "url": "https://app.atmo.dev:8000/api/v2/images/63446ced-33ab-538d-a586-b4fda157f6bc.json",
                "user": 74,
                "uuid": "63446ced-33ab-538d-a586-b4fda157f6bc"
            },
            "ip_address": "149.165.157.57",
            "name": "test123",
            "projects": [
                45
            ],
            "provider": {
                "active": true,
                "description": "",
                "end_date": null,
                "id": 4,
                "name": "Jetstream - Indiana University",
                "public": true,
                "start_date": "2016-01-28T23:40:07.074619Z",
                "url": "https://app.atmo.dev:8000/api/v2/providers/f906a5ee-34a8-499a-9185-a35feb3d6f01.json",
                "uuid": "f906a5ee-34a8-499a-9185-a35feb3d6f01"
            },
            "scripts": [],
            "shell": false,
            "size": {
                "active": true,
                "alias": "3",
                "cpu": 6,
                "disk": 60,
                "end_date": null,
                "id": 3,
                "mem": 16384,
                "name": "m1.medium",
                "start_date": "2016-01-29T17:49:02.283049Z",
                "url": "https://app.atmo.dev:8000/api/v2/sizes/d3aab647-d81a-4842-9cdc-3a9fcbb5c588.json",
                "uuid": "d3aab647-d81a-4842-9cdc-3a9fcbb5c588"
            },
            "start_date": "2016-05-02T19:42:39Z",
            "status": "active",
            "url": "https://app.atmo.dev:8000/api/v2/instances/bef907ca-2756-4bde-9736-3f1bcc8b58a6.json",
            "usage": 14110.74,
            "user": {
                "id": 1,
                "url": "https://app.atmo.dev:8000/api/v2/users/01a3cde8-3759-41f8-8b4a-304f31f260d1.json",
                "username": "sgregory",
                "uuid": "01a3cde8-3759-41f8-8b4a-304f31f260d1"
            },
            "uuid": "bef907ca-2756-4bde-9736-3f1bcc8b58a6",
            "version": {
                "id": "32e8d765-081d-4493-ab16-5d5f1867cea9",
                "name": "1.0",
                "url": "https://app.atmo.dev:8000/api/v2/image_versions/32e8d765-081d-4493-ab16-5d5f1867cea9.json"
            },
            "vnc": true
        },
        {
            "activity": null,
            "allocation_source": null,
            "end_date": null,
            "id": 5199,
            "identity": {
                "id": "2",
                "provider": 4,
                "url": "https://app.atmo.dev:8000/api/v2/identities/0ed4a4f1-7657-4c61-8bd5-a420fddc569b.json",
                "uuid": "0ed4a4f1-7657-4c61-8bd5-a420fddc569b"
            },
            "image": {
                "description": "Based on Ubuntu 14.04.3 Development\nPatched up to date as of 5/12/16\nBase Ubuntu 14.04.3 + Xfce + Xfce-goodies, firefox, icon sets and themes",
                "end_date": null,
                "icon": null,
                "id": 54,
                "name": "Ubuntu 14.04.3 Development GUI",
                "start_date": "2016-06-24T19:57:15Z",
                "url": "https://app.atmo.dev:8000/api/v2/images/ead21e76-20e0-5ebd-8df6-e1262a6c1b56.json",
                "user": 14,
                "uuid": "ead21e76-20e0-5ebd-8df6-e1262a6c1b56"
            },
            "ip_address": "149.165.169.136",
            "name": "AnsibleDeployTest 7",
            "projects": [
                45
            ],
            "provider": {
                "active": true,
                "description": "",
                "end_date": null,
                "id": 4,
                "name": "Jetstream - Indiana University",
                "public": true,
                "start_date": "2016-01-28T23:40:07.074619Z",
                "url": "https://app.atmo.dev:8000/api/v2/providers/f906a5ee-34a8-499a-9185-a35feb3d6f01.json",
                "uuid": "f906a5ee-34a8-499a-9185-a35feb3d6f01"
            },
            "scripts": [],
            "shell": false,
            "size": {
                "active": true,
                "alias": "1",
                "cpu": 1,
                "disk": 8,
                "end_date": null,
                "id": 1,
                "mem": 2048,
                "name": "m1.tiny",
                "start_date": "2016-01-29T17:49:02.247768Z",
                "url": "https://app.atmo.dev:8000/api/v2/sizes/faf7efd9-1ed2-425e-9697-509742581c87.json",
                "uuid": "faf7efd9-1ed2-425e-9697-509742581c87"
            },
            "start_date": "2016-05-25T03:30:24Z",
            "status": "active",
            "url": "https://app.atmo.dev:8000/api/v2/instances/181d019d-8ca2-4bf6-9e93-0f3d213b5084.json",
            "usage": 1815.99,
            "user": {
                "id": 1,
                "url": "https://app.atmo.dev:8000/api/v2/users/01a3cde8-3759-41f8-8b4a-304f31f260d1.json",
                "username": "sgregory",
                "uuid": "01a3cde8-3759-41f8-8b4a-304f31f260d1"
            },
            "uuid": "181d019d-8ca2-4bf6-9e93-0f3d213b5084",
            "version": {
                "id": "2528e68b-1051-469a-99d6-a24fac1ace8b",
                "name": "1.0-base",
                "url": "https://app.atmo.dev:8000/api/v2/image_versions/2528e68b-1051-469a-99d6-a24fac1ace8b.json"
            },
            "vnc": true
        }
    ]
}

export default api.results
export { api };
