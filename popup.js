let search = document.getElementById('searchPage');

search.onclick = function(element) {
    var text = document.getElementById('searchParam').value;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id,
            { code: `var arr = [], links = document.links; for (var i = 0; i < links.length; i++){arr.push(links[i].href);} arr;` },
            function (test){ 
                arr = test[0];
                var lastTag = document.getElementById('charCount');
                let chars   = lastTag.value;
                console.log(chars);
                for (var i = 0; i < arr.length; i++) {
                    (function(arr, i){
                        let xhr = new XMLHttpRequest();
                        xhr.open("GET", arr[i], true);
                        xhr.onload = function(e) {
                            let url = arr[i]; 
                            console.log
                            findMatches(xhr.responseText, url, text, lastTag, parseInt(chars));
                        };
                        xhr.onerror = function() {
                            console.error("Error occured with XMLHTTPRequest");
                        }
                        xhr.send();
                    })(arr, i);
                }
            })
      })
};


function findMatches(content, url, searchTerm, lastTag, chars){
    content = content.replace(/(<([^>]+)>)/ig,"");
    var n = content.search(searchTerm);

    if (n != -1) {
        var div = document.createElement('div');
        div.setAttribute('class', 'matched');

        var a = document.createElement('a');
        a.setAttribute('href', url);
        a.innerHTML = url;
        var para = document.createElement('p');
        para.innerHTML = '\n' + content.substring(n - chars, n + chars) + '\n';

        div.appendChild(a);
        div.appendChild(para);

        lastTag.parentNode.insertBefore(div, lastTag.nextSibling);
        lastTag = div;
    }
}