const server = 'http://localhost:8000';

export default function api(url: string, post?: object) {
    let settings = {};
    if (post) {
        settings = {
            method: 'post',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(post),
        };
    }

    return window.fetch(`${server}/api/${url}`, settings)
        .then(response => post ? response.ok : response.json());
}