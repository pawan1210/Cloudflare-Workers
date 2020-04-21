addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */



 

async function handleRequest(request) {
   
  // fetch url using the given api
  let variants={};
   await fetch('https://cfw-takehome.developers.workers.dev/api/variants').then((response)=>{
      return response.json();
   }).then((data)=>{
      variants=data;
   });
   
   // get cookie
   let cookie=request.headers.get('Cookie');
   let isNew=false;
   let randomVariant=-1;
   
   let path='url';

   //check if cookie is already present or not.
   //If yes then set the variant according to the cookie present.
   if (cookie && cookie.includes(`${path}=0`)) {
    randomVariant=0;
   } 
   else if (cookie && cookie.includes(`${path}=1`)) {
    randomVariant=1;
   } 
   else {
    randomVariant=Math.floor(Math.random()*2);
    isNew = true
   }
    
    //Make a new request.
    let newRequest=new Request(variants['variants'][randomVariant],{
      method:request.method,
      headers:request.headers
    });
    
    let res=await fetch(newRequest);

    //If isNew is true or cookie was not present then append the Set-cookie header.
    if(isNew){

      let newHeaders = new Headers(res.headers);
      newHeaders.append('Set-Cookie',`${path}=${randomVariant}`);
      
      res=new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: newHeaders
      });
    }

    // change title , description, url of the fetched variant using HTMLRewriter Api.
   return new HTMLRewriter().on('title', new ElementHandler()).on('h1#title', new ElementHandler())
   .on('p#description', new ElementHandler()).on('a#url', new ElementHandler()).transform(res);
  
}

class ElementHandler {
  // check the type of element
  element(element) {
    if(element.tagName=='title'){
      
      element.prepend("CL Project");
    }
    
    else if(element.getAttribute('id')=='title'){
      element.prepend("CL Project");
    }
    
    else if(element.getAttribute('id')=='description'){
      element.prepend("CL Project")
    }
    
    else if(element.getAttribute('id')=='url'){
      element.setAttribute('href','https://www.linkedin.com/in/pawan-saggu-06589b157/');
      element.setInnerContent("Welcome to the Linkedin Profile of Pawan Saggu");
    }
  }
  
  comments(comment) {

  }

  text(text) {
  }
}