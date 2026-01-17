const firebaseConfig = {
  apiKey: "AIzaSyCdiOw1cuv88ZPdJzxqbCzqJsetv6uFrQ0",
  authDomain: "istiaq-6e3c6.firebaseapp.com",
  projectId: "istiaq-6e3c6",
  storageBucket: "istiaq-6e3c6.appspot.com"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const loginBtn = document.getElementById("loginBtn");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginError = document.getElementById("loginError");
const postForm = document.getElementById("postForm");

//POST
const form = document.getElementById("postForm");
const input = document.getElementById("postInput");
const postsDiv = document.getElementById("posts");

//LOGIN
loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    await auth.signInWithEmailAndPassword(email, password);
    postForm.style.display = "block";
    document.querySelector(".login-container").style.display = "none";
  } catch {
    loginError.textContent = "Incorrect email or password!";
  }
});

auth.onAuthStateChanged(user => {
  if (user) {
    postForm.style.display = "block";
    document.querySelector(".login-container").style.display = "none";
  }
});

//LOAD
db.collection("posts")
  .orderBy("created", "desc")
  .onSnapshot(snapshot => {
    postsDiv.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();

      const postDiv = document.createElement("div");
      postDiv.className = "post";

      //TIMESTAMP
      const timeDiv = document.createElement("div");
      timeDiv.className = "timestamp";
      timeDiv.textContent = data.created
        ? data.created.toDate().toLocaleString()
        : "Just now";
      postDiv.appendChild(timeDiv);

      //POST
      if (data.text) {
        const textDiv = document.createElement("div");
        textDiv.textContent = data.text;
        postDiv.appendChild(textDiv);
      }

      postsDiv.appendChild(postDiv);
    });
  });

//SUBMIT

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  try {
    await db.collection("posts").add({
      text,
      created: firebase.firestore.FieldValue.serverTimestamp()
    });

    //ERROR
    input.value = "";
  } catch (err) {
    console.error("Post failed:", err);
    alert("Post failed. Check console for details.");
  }
});
