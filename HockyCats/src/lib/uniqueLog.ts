export const uniqueLog = () => {
    let prev
    return (...args) => { 
      let txt = args.join(" ")
      if(prev!=txt) {
        console.log(txt); 
        prev = txt;
      } 
    }
  }