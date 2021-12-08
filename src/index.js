const state = {
    posts: []
}

function renderImages() {
    const imageSection = document.querySelector('.image-container')
    imageSection.innerHTML = ''
    for (const post of state.posts) {
        const articleEl = document.createElement('article')
        articleEl.setAttribute('class', 'image-card')
        const removePost = document.createElement('button')
        removePost.textContent = 'X'
        removePost.addEventListener('click', function () {
            state.posts = state.posts.filter(function (id) {
                return id !== post.id
            })
            deletePost(post.id)
            render()
        })
        const h2El = document.createElement('h2')
        h2El.setAttribute('class', 'title')
        h2El.textContent = post.title
        const imgEl = document.createElement('img')
        imgEl.setAttribute('class', 'image')
        imgEl.setAttribute('src', post.image)
        const divEl = document.createElement('div')
        divEl.setAttribute('class', 'likes-section')
        const spanEl = document.createElement('span')
        spanEl.setAttribute('class', 'likes')
        spanEl.textContent = post.likes + 'likes'
        const buttonEl = document.createElement('button')
        buttonEl.setAttribute('class', 'like-button')
        buttonEl.textContent = '♥'
        buttonEl.addEventListener('click', function () {
            post.likes++
            updateLikes(post)
            render()
        })
        const ulEl = document.createElement('ul')
        ulEl.setAttribute('class', 'comments')
        for (const comment of post.comments) {
            const liEl = document.createElement('li')
            liEl.textContent = comment.content
            const deleteBtn = document.createElement('button')
            deleteBtn.textContent = 'X'
            deleteBtn.addEventListener('click', function () {
                state.posts = state.posts.filter(function (id) {
                    return id !== comment.id
                })
                deleteComments(comment.id)
                render()
            })
            liEl.append(deleteBtn)
            ulEl.append(liEl)
        }
        const formEl = document.createElement('form')
        formEl.setAttribute('class', 'comment-form')
        const inputEl = document.createElement('input')
        inputEl.setAttribute('type', 'text')
        inputEl.setAttribute('class', 'comment-input')
        inputEl.setAttribute('name', 'comment')
        inputEl.setAttribute('placeholder', 'Add a comment...')
        const submitButtonEl = document.createElement('button')
        submitButtonEl.setAttribute('type', 'submit')
        submitButtonEl.setAttribute('class', 'comment-button')
        submitButtonEl.textContent = 'Post'
        formEl.append(inputEl, submitButtonEl)
        formEl.addEventListener('submit', function (event) {
            event.preventDefault()
            const comment = formEl.comment.value
            createComment(comment).then(function (postFromServer) {
                state.posts.push(postFromServer)
                render()
                formEl.reset()
            })
        })
        divEl.append(spanEl, buttonEl)
        articleEl.append(removePost, h2El, imgEl, divEl, ulEl, formEl)
        imageSection.append(articleEl)

    }
}
function getPost() {
    return fetch('http://localhost:3000/images').then(function (resp) {
        return resp.json()
    })
}
function deleteComments(id) {
    return fetch(`http://localhost:3000/comments/${id}`, {
        method: 'DELETE'
    })
}
function deletePost(id) {
    return fetch(`http://localhost:3000/images/${id}`, {
        method: 'DELETE'
    })
}
function updateLikes(post) {
    return fetch(`http://localhost:3000/images/${post.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    })
}
function createComment(content, imageId) {
    return fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: content,
            imageId: imageId
        })
    }).then(function (resp) {
        return resp.json()
    })
}

getPost().then(function (postFromServer) {
    state.posts = postFromServer
    render()
})
function render() {
    renderImages()
}

render()