import Navbar from "../components/Navbar.jsx";

export default function Home() {
  return (
    <>
      <Navbar />
  
      <h1>Home</h1>
      <p> This project is currently a work in progress! Many years ago, I had worked with integer partitions for a bit, and had come across some interesting ideas. In the interest of sharing some of these facts and to develop some of the ideas from back then into more interactive and accessible forms, this project came about.
      </p>
      <p>Currently, the text-based calculator works which provides an interface to the javascript port of some of the core funcitons, but in the future, slides explaining the concepts will be added, as well as an interactive visual calculator! However, doing this will take a bit of time as I familiarize myself with React and other front-end stuff.</p>
    </>
  )
}