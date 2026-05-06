import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Notes from './pages/Notes';
import NotesIndex from './pages/NotesIndex';
import Projects from './pages/Projects';
import Posts from './pages/Posts';
import PostsIndex from './pages/PostsIndex';
import Layout from './components/Layout';
import { ThemeProvider } from './components/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="panda-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="projects" element={<Projects />} />
            <Route path="notes" element={<NotesIndex />} />
            <Route path="notes/*" element={<Notes />} />
            <Route path="posts" element={<PostsIndex />} />
            <Route path="posts/*" element={<Posts />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
