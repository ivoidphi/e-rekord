function showlogs(){
    document.getElementById("productsTable").style.display = "none";
    document.getElementById("logsTable").style.display = "block";
    document.getElementById("accountsTable").style.display = "none";
    document.getElementById("dataTable").style.display = "none";
    document.getElementById("productsButton").classList.remove("active");  
    document.getElementById("logsButton").classList.add("active");
    document.getElementById("accountsButton").classList.remove("active");
    document.getElementById("dataButton").classList.remove("active");
}

function showproducts(){
    document.getElementById("productsTable").style.display = "block";
    document.getElementById("logsTable").style.display = "none";
    document.getElementById("accountsTable").style.display = "none";
    document.getElementById("dataTable").style.display = "none";
    document.getElementById("productsButton").classList.add("active");
    document.getElementById("logsButton").classList.remove("active");
    document.getElementById("accountsButton").classList.remove("active");
    document.getElementById("dataButton").classList.remove("active");
}

function showaccounts(){
    document.getElementById("productsTable").style.display = "none";
    document.getElementById("logsTable").style.display = "none";
    document.getElementById("accountsTable").style.display = "block";
    document.getElementById("dataTable").style.display = "none";
    document.getElementById("productsButton").classList.remove("active");
    document.getElementById("logsButton").classList.remove("active"); 
    document.getElementById("accountsButton").classList.add("active");
    document.getElementById("dataButton").classList.remove("active");
}

function showdata() {
    document.getElementById("productsTable").style.display = "none";
    document.getElementById("logsTable").style.display = "none";
    document.getElementById("accountsTable").style.display = "none";
    document.getElementById("dataTable").style.display = "block";
    document.getElementById("productsButton").classList.remove("active");
    document.getElementById("logsButton").classList.remove("active");
    document.getElementById("accountsButton").classList.remove("active");
    document.getElementById("dataButton").classList.add("active");
}

function toggleMenu(){
    const showMenu = document.getElementById("leftsection").style.display;

    if(showMenu == "block"){
        document.getElementById("leftsection").style.display = "none";
        document.getElementById("toggleMenu").style.minWidth = "2rem";
    }else{
        document.getElementById("leftsection").style.display = "block";
        document.getElementById("toggleMenu").style.minWidth = "5rem";
    }
}
