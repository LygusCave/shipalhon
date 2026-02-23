const transForm = document.getElementById("transForm");
transForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const userstext = transForm.text1.value;
    if (!userstext.trim()) return;

     try {
        const response = await fetch("/transcriptCN", { 
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ utext: userstext })
        });
        
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const responseText = await response.text();
        transForm.text2.value = responseText;
        console.log("Успех:", responseText);
        
        
    } catch (error) {
        console.error("Ошибка при отправке:", error);
        alert("Не удалось отправить данные.");
    }
});