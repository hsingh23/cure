// $(".last").change(
//     function (){
//         $(this).after('<input type=text class="span3 more last">')
//         .removeClass('last')
//         .unbind();
//         $(this).next().bind('change',changed);
//     }
// );
// var changed = function () {
//     $(this).after('<input type=text class="span3 more last">')
//     .removeClass('last')
//     .unbind()
//     .next().bind('change',changed);
// };
$(".more.multi").change(
    function (){
        that = $(this);
        that.before('<input type=text class="span3 more">')
        .prev().val(that.val()).next().val("").focus();
        $('input:text[value=\"\"]').not('.multi').not('.init').remove();
    }
);