const api = {
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
        {
            "compute_allowed": 10000,
            "compute_used": 10.0,
            "global_burn_rate": 5.0,
            "id": 1,
            "name": "durp a lurp test allocation",
            "source_id": "1",
            "updated": "2016-08-04T18:21:56.204117Z",
            "url": "https://app.atmo.dev:8000/api/v2/allocation_sources/1.json",
            "user_burn_rate": 5.0,
            "user_burn_rate_updated": "2016-08-04T18:19:39.300550Z"
        },
        {
            "compute_allowed": 100,
            "compute_used": 7.0,
            "global_burn_rate": 5.0,
            "id": 2,
            "name": "another test source",
            "source_id": "2",
            "updated": "2016-08-04T18:21:56.204117Z",
            "url": "https://app.atmo.dev:8000/api/v2/allocation_sources/1.json",
            "user_burn_rate": 5.0,
            "user_burn_rate_updated": "2016-08-04T18:19:39.300550Z"
        }
    ]
};

export default api.results
export { api };
