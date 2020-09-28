
/*
 =========================================================
 * I9TI - v1.0.0
 =========================================================
 * url: http://www.i9ti.com.br
 * Copyright 2017
 =========================================================

 * Script responsável por remover caracteres especiais das listas do Office365.
 *
 */




var elements = ["h1","h2","h3","h4","p","strong","label","span","a"];
function targetZWS(){
    for (var i = 0; i < elements.length; i++) {
      jQuery(elements[i]).each(function() {
        removeZWS(this);
      });
    }
}
function removeZWS(target) {
  jQuery(target).html(jQuery(target).html().replace(/\u200B/g,''));
}

/*load functions*/
$(document).ready(function() {
    _spBodyOnLoadFunctionNames.push("targetZWS");
    //$('.o365cs-nav-brandingText').text('Portal i9Ti');
    
    $("span:contains('SharePoint')").text('Portal i9Ti');
});