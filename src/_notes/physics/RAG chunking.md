**Date :** Saturday, May 2nd 2026
**Topic :** #programming

### Points 
-  We are converting chunks into embeddings (a vector of floats in d dimensions like d = 743)
### The Semantic Search Workflow

1. *Ingestion:* Load your `.md` and `.pdf` files.
2. *Chunking:* Break long files into smaller, overlapping segments (e.g., 500–1000 tokens).
3. *Embedding:* Use `bge-base-en` to turn those segments into 768-dimensional vectors.
4. *Vector Store:* Store these vectors in a local database (like **ChromaDB** or **FAISS**).
5. *Query:* When you search, the query is also embedded, and the "closest" vectors are retrieved.

$$f(\theta,\phi) = \int _0 ^\theta u(r,\phi)\ G(r)\ d^3r$$
$$\begin{pmatrix} a & 0 & 0 & 0 & 0 & 0 & 0 & c \\ 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 \\ b & 0 & 0 & 0 & 0 & 0 & 0 & d   \end{pmatrix}$$




