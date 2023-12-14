
function get() {
    axios.get('http://localhost:5555/list').then(r => {
        console.log(r)
        reload(JSON.stringify(r.data.results.rows));
    })
}

function create(data) {
    axios.post('http://localhost:5555/create', data).then(r => get())
}

function destroy() {
    axios.delete('http://localhost:5555/delete').then(r => {
        if (r.success)
            return alert('Item Excluído')

        return alert('Erro')
    })
}

function reload(data) {
    var div = document.getElementById('result')
    div.innerText = data
}


window.addEventListener('load', () => {
    get();

    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        //to prevent reload
        e.preventDefault();
        //creates a multipart/form-data object
        let data = new FormData(form);
        create({
            id: data.get('id'),
            name: data.get('name'),
        });
    });
});