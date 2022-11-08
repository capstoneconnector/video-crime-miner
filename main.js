function main(){
    while (true){
        var choices = "(1) Upload a file\n(2)Scan for faces in a video\n(3) Label Detection for Video\n(4)View my files\n(q) Quit"
        var input = ""
        console.log("What would you like to do?")
        console.log(choices)
        input = prompt()
        if(input=="q"){
            //exit the program
        }else if(input=="1"){
            //upload a file
        }else if(input=="2"){
            //scan video faces
        }else if(input=="3"){
            //label detection video
        }else if(input=="4"){
            //view files
        }else{
            console.log("ERROR: invalid choice")
        }

    }
}