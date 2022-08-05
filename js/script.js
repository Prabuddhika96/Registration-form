let require_fields=["name","gender","date_of_birth","NIC","address","telephone","zscore","course"];
let combination_set=["combination_1","combination_2","combination_3","combination_4","combination_5"];

let student={name : '', gender : '', date_of_birth : '', NIC : '', address : '', telephone : '',zscore : '', course : ''};
let combination_choices={combination_1 : '',combination_2 : '', combination_3 : '', combination_4 : '', combination_5 : '',};

const combination_no = [1,2,3,4,8,15,18,19,21,22,26,27,28,31,32];
const combination_name=[
    "Biology** , Chemistry",
    "Biology*, Chemistry, Statistics",
    "Biology*, Chemistry, Computer Science",
    "Biology*, Chemistry, Physics",
    "Biology*, Chemistry, Geology",
    "Chemistry, Geology, Physics",
    "Chemistry, Mathematics**",
    "Chemistry, Mathematics*,Physics",
    "Chemistry, Computer Science, Statistics",
    "Chemistry, Mathematics*, Statistics",
    "Mathematics*, Computer Science, Statistics",
    "Physics, Mathematics**",
    "Physics, Computer Science, Geology",
    "Physics, Mathematics*, Computer Science",
    "Physics, Mathematics*, Statistics"
];

//this is used to manage combination according to subject stream
function myFunction(value) {
    let x = document.getElementById("course").value;
    let set=document.getElementById('combination_set');
    set.innerHTML="";

    createCombination(x)
    resetFunction(value);
    if(x=='biology' || x== 'physical'){
        for(let i=0;i<combination_set.length;i++){
            resetFunction(combination_set[i]);
        }
    }   
}


//this is used to create choose combination area
function createCombination(x){
    if(x.localeCompare('physical')==0 || x.localeCompare('biology')==0){
        let set=document.getElementById('combination_set');
        let h4=document.createElement('h4');
        
        h4.innerHTML='combination'
        set.appendChild(h4);

        for(let i=1;i<6;i++){
            let label=document.createElement('label');
            label.innerHTML="Choice "+i;
            set.appendChild(label);

            let div=document.createElement('div');
            div.setAttribute('class','form-select');

            let select=document.createElement('select');
            select.setAttribute('name','combination_'+i);
            select.setAttribute('id','combination_'+i);
            select.setAttribute('onchange','resetFunction("combination_'+i+'")');
            createOption(select);
            div.appendChild(select);

            let p=document.createElement('p');
            p.setAttribute('class','error');
            p.setAttribute('id','error-combination_'+i)
            p.style.marginBottom='1em';
            div.appendChild(p);

            set.appendChild(div);
        }
    }
}

//this function is used to create combination options
function createOption(select){
    select.innerText="";
    let disable = document.createElement("option");
    disable.innerHTML="Choose Combination";
    disable.setAttribute("value", "");
    disable.disabled = true;
    disable.selected = true;
    disable.defaultSelected=true;
    disable.style.color='gray';
    select.appendChild(disable);

    for(let i=0;i<combination_no.length;i++){
        let z = document.createElement("option");
        z.setAttribute("value", combination_no[i]);
        z.innerHTML=combination_no[i]+" - "+combination_name[i];

        select.appendChild(z);
    }
    
}

// this function is used to print errors
function printError(id,msg){
    let errmsg=document.getElementById(id);
    msg=msg.replaceAll("_", " ").toUpperCase();
    errmsg.innerHTML=msg;
}

//this unction is used to get data from form to student object
function loadData(){
    student.name=document.getElementById('name').value;

    let val=document.querySelector("input[type='radio'][name=gender]:checked");
    if(!val){
        val="";
    }else{
        val=val.value;
    }
    student.gender=val;
    student.date_of_birth=document.getElementById('date_of_birth').value;
    student.NIC=document.getElementById('NIC').value;
    student.address=document.getElementById('address').value;
    student.telephone=document.getElementById('telephone').value;
    student.zscore=document.getElementById('zscore').value;
    student.course=document.getElementById('course').value;

    if(student.course=='physical' || student.course=='biology'){
        combination_choices.combination_1=document.getElementById('combination_1').value;
        combination_choices.combination_2=document.getElementById('combination_2').value;
        combination_choices.combination_3=document.getElementById('combination_3').value;
        combination_choices.combination_4=document.getElementById('combination_4').value;
        combination_choices.combination_5=document.getElementById('combination_5').value;
    }
    else{
        for(const key in combination_choices){
            combination_choices[key]='';
        }
    }
}

//validation
//all fields are required. 
document.getElementById('submit').addEventListener('click', function(e){
    e.preventDefault();
    loadData();

    let r1=checkFields(student);

    let x=document.getElementById('course').value;
    let r2=true;
    let duplicate=true;
    if(x=='physical' || x=='biology'){    
        r2=checkFields(combination_choices);
        duplicate=duplicates();
    }  

    if(r1 && r2 && duplicate){
        let valid=true;
        for(let i=0;i<require_fields.length;i++){
            if(!resetFunction(require_fields[i])){
                valid=false;
                break;
            }
        }
        if(valid){
            document.getElementById('container').innerHTML=""
            printDetails();
        }        
    }
});

//this function is used to check whether the fields are already filled
function checkFields(student){
    let r=true;

    for(const key in student){
        if(student[key]==''){
            r=false;
            printError('error-'+key,key+" is required.");
        }
        else{
            resetFunction(key);
        }
    }  
    return r;
}


//This function is used to handle errors when changing fields
function resetFunction(value){
    let r=true;
    printError('error-'+value,"");

    if(value=='name'){
        let str=document.getElementById(value).value;

        if(!onlyLetters(str)){
            r=false;
            printError('error-'+value,value+" is not valid")
        }        
    }

    if(value=='zscore'){
        let str=document.getElementById(value).value;

        if(-4>str || str>4){
            r=false;
            printError('error-'+value,value+" is not valid")
        }        
    }

    if(value=='telephone'){
        let str=document.getElementById(value).value;

        if(str.length!=10 || !onlyNumber(str)){
            r=false;
            printError('error-'+value,value+" is not valid")
        }        
    }
    return r;
}

// This function is used to check if the same combination of choices exists
function duplicates(){
    let duplicate=true;

    for(const key1 in combination_choices){
        for(const key2 in combination_choices){
            if(combination_choices[key1]==combination_choices[key2] && key1!=key2 && combination_choices[key1]!='' && combination_choices[key2]!=''){
                duplicate= false;
                printError('error-'+key1,"Same choice. Please check your choices again.");
                printError('error-'+key2,"Same choice. Please check your choices again.");
            }
        }
    }
    return duplicate;
}

// this function is used to check whether if input is only contain letters 
function onlyLetters(str) {
    return /^[a-zA-Z\s\.]+$/.test(str);
}

function onlyNumber(str) {
    for(let i=0;i<str.length;i++){
        if(Number.isInteger(parseInt(str.charAt(i)))==false){
            return false;
        }
    }
    return true;
}

//This is used to clear errors when the reset button is clicked
document.getElementById('reset').addEventListener('click',function(){
    document.getElementById('combination_set').innerHTML='';

    for(let i=0;i<require_fields.length;i++){
        printError('error-'+require_fields[i],"");
    }
});

//print details
function printDetails(){
    document.getElementById('reg_success').style.display="block";
    let div=document.getElementById('content');
    div.innerHTML="";
    for(const key in student){
        let p1=document.createElement('p');
        let key1=key;
        key1=key1.replaceAll("_", " ");
        if(key)
        key1=key1.charAt(0).toUpperCase()+key1.substring(1);
        p1.innerHTML=key1;

        let p2=document.createElement('p');
        if(key=='course'){
            p2.innerHTML=student[key].toUpperCase();
        }
        else{
            p2.innerHTML=student[key];
        }

        p1.setAttribute('id','caption')
        div.appendChild(p1);
        div.appendChild(p2);
    }

    if(student.course=='biology' || student.course=='physical'){
        for(const key in combination_choices){
            let p1=document.createElement('p');
            let key1=key;
            key1=key1.replaceAll("_", " ");
            key1=key1.charAt(0).toUpperCase()+key1.substring(1);
            p1.innerHTML=key1;
    
            let p2=document.createElement('p');
            let index=-1;
            for(let i=0;i<combination_no.length;i++){
                let val=combination_choices[key];
                if(parseInt(val)==combination_no[i]){
                    index=i;
                    break;
                }
            }
            console.log(index);
            p2.innerHTML=combination_no[index]+" - "+combination_name[index];
    
            p1.setAttribute('id','caption')
            div.appendChild(p1);
            div.appendChild(p2);
        }
    }
}