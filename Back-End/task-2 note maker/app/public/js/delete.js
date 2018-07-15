$(document).ready(function(){
  $('#delete-note').on('click',function(e){
    e.preventDefault()
    const id = e.target.getAttribute('data-id')
    $.ajax({
      type:'DELETE',
      url:'/notes/' + id,
      success: function(res){
        alert('Deleting Note')
        window.location.href ='/notes'
      },
      error:function(err){
        console.log(err)
      }
    });
  })
  $(document).ready(function(){
    $('.myList').on('click',function(e){
      if(!e.target.matches('i')) return;
      let id = (e.target.getAttribute('data-id'));
      let listId = document.querySelector('.myList').getAttribute('data-list-id')
        e.preventDefault()
        $.ajax({
        type:'DELETE',
        url:'/todos/delete/' + id,
        success: function(res){
          alert('Deleting Todo Item')
          window.location.href ='/todos/'+listId
        },
        error:function(err){
          console.log(err)
        }
      });
    })
  })
})
$(document).ready(function(){
  $('.delete-list').on('click',function(e){
    if(!e.target.matches('i')) return;
    e.preventDefault()
    const id = e.target.getAttribute('data-id')
    $.ajax({
      type:'DELETE',
      url:'/lists/delete/' + id,
      success: function(res){
        alert('Deleting Note')
        window.location.href ='/lists'
      },
      error:function(err){
        console.log(err)
      }
    });
  })
})
