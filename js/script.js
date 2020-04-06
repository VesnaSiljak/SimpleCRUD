const url = 'https://frontend-api-test-nultien.azurewebsites.net/api/';
let categories = [];

//get Categories
function getCategories() {
    $.get(url + 'Category', function (data) {
        categories = data.resultData;
        let html_content = '';
        let select_content = '';
        if(categories.length>0){
            $.each(categories, function (i, val) {
                html_content += '<li onclick="filterCategory(' + val.id + ')">' + val.name + '</li>';
                select_content += '<option value="' + val.id + '">' + val.name + '</option>'
            });
        }
        else{
            html_content = '<p>No Categories</p>';
            select_content = '<option value="0">No Category</option>'
        }
        

        $('#categories').html(html_content);
        $('#category').html(select_content)
    });
}

//print Posts

function printPosts(posts) {
    let html_content = '';
    if (posts.length > 0) {
        $.each(posts, function (i, val) {
            const dateObj = new Date(val.createdAt);
            const month = dateObj.getUTCMonth() + 1;
            const day = dateObj.getUTCDate();
            const year = dateObj.getUTCFullYear();
            const hours = dateObj.getHours();
            const minutes = dateObj.getMinutes();

            var newdate = day + "." + month + "." + year;
            const time = hours + ':' + minutes;
            html_content += `                    
                <article class="blogpost">
                    <div class="top-content">
                        <div class="main-info">
                            <img src="" alt="">
                                <div>
                                    <h2>`+ val.title + `</h2>
                                    <p>Posted date: `+ newdate + ` at ` + time + ` by Some person</p>
                                </div>

                            </div>
                            <div class="actions">
                                <button onclick="editPost(`+ val.id + `)">Edit</button>
                                <button onclick="deletePost(`+ val.id + `)" class="deletepost">Delete</button>
                            </div>
                        </div>
                        <div class="description">
                        `+ val.text + `
                        </div>
                        <div class="blog-images">
                            <img src="" alt="">
                                <img src="" alt="">
                                    <img src="" alt="">
                        </div>
                    </article>
                    `
        });
    }
    else {
        html_content = '<p id="noposts">No Posts</p>';
    }


    $('#posts').html(html_content)
}

//get Posts
function getPosts() {
    $.get(url + 'BlogPosts', function (data) {
        const posts = data.resultData.reverse();
        printPosts(posts);
    });
}

//filter Category
function filterCategory(id) {
    $.ajax({
        url: url + 'BlogPosts/GetPostByCategory',
        type: 'GET',
        data: "categoryId=" + id,
        success: function (data) {
            const posts = data.resultData.reverse();
            printPosts(posts);
        }
    });
}

//search Post
function searchPost(text) {
    $.ajax({
        url: url + 'BlogPosts/Search',
        type: 'GET',
        data: "term=" + text,
        success: function (data) {
            const posts = data.resultData.reverse();
            printPosts(posts);
        }
    });
}

//edit Post
function editPost(id) {
    $('.popup-bg').css('display', 'flex');
    $.get(url + 'BlogPosts/' + id, function (data) {
        var post = data.resultData;
        $('#title').val(post.title);
        $('#text').val(post.text);
        $('#category').val(post.categoryId);
        $('.popup h3').text('Edit Post');
        $('#post').attr('action', 'edit');
        $('#post').attr('postid', id);
    })
}

//delete Post
function deletePost(id) {
    $.ajax({
        url: url + 'BlogPosts/' + id,
        type: 'DELETE',
        success: function () {
            getPosts();
        }
    });
}

//reset form
function reset() {
    $('#title').val('');
    $('#text').val('');
    $('#category').val(categories[0].id);
}

$(document).ready(function () {

    // menu toggle  
    $('#menu-btn').click(function () {
        $('#main-nav').slideToggle();
    })

    //open popup
    $('#addpost').click(function () {
        $('#post').attr('action', 'add');
        $('.popup-bg').css('display', 'flex');
    })

    //close messages
    $('.close-msg').click(function () {
        $('#messages').slideUp();
    })

    //validation input
    $("#title").blur(function () {
        if ($('#title').val() != '') {
            $('#title-error').hide();
        }
    });
    $("#text").blur(function () {
        if ($('#text').val() != '') {
            $('#text-error').hide();
        }
    });

    //close popup
    $('#cancel').click(function (event) {
        event.preventDefault();
        $('.popup-bg').hide();
        reset();
    })

    //handle post
    $('#post').click(function (event) {
        event.preventDefault();
        const action = $(this).attr('action');
        const title = $('#title').val();
        const text = $('#text').val();
        const categoryId = $('#category').val();
        let valid = true;
        if (title == '') {
            valid = false;
            $('#title-error').show();
        }
        if (text == '') {
            valid = false;
            $('#text-error').show();
        }

        if (valid) {
            $('.error-message').hide();
            let dataObj = {
                title: title,
                text: text,
                categoryId: categoryId
            }
            if (action == 'add') {
                $.ajax({
                    url: url + 'BlogPosts',
                    type: "POST",
                    data: JSON.stringify(dataObj),
                    contentType: "application/json; charset=utf-8",
                    success: function () {
                        getPosts();
                    }
                })
            }
            else {
                const postid = $(this).attr('postid');
                dataObj.id = postid;
                $.ajax({
                    url: url + 'BlogPosts/' + postid,
                    type: "PUT",
                    data: JSON.stringify(dataObj),
                    contentType: "application/json; charset=utf-8",
                    success: function () {
                        getPosts();
                    }
                })
            }
            $('.popup-bg').hide();
        }

    })

    $('#close-popup').click(function () {
        $('.popup-bg').hide();
        reset();
    })

    //search event
    $('#search').keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            const text = $('#search').val();
            if (text != '') {
                searchPost(text);
            }
        }
    });

    getCategories()
    getPosts();
});