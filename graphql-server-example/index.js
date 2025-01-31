import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// Schema, berisi deskripsi data yang kita punya
const typeDefs = `#graphql
  # Untuk menulis komen di graphql, gunakan "#"
  # "Book" type untuk mendefinisikan kolom yang bisa kita dapatkan lewat query untuk semua buku dari data kita.

  type Book {
    id : ID 
    title: String
    author: String
  }


  # "Query" type untuk mendifinisikan query /entry point yang bisa diakses oleh client, dalam hal ini query "books" yang akan mengembalikan array dari "Book" type.

  type Query {
    books: [Book]
    book(bookId : ID) : Book
  }

  # input type untuk mengelompokkan parameter yang banyak menjadi satu
  input BookInput {
    title: String
    author: String
  }

  # "Mutation" type untuk memodifikasi data yang ada di server, dalam hal ini menambahkan data baru ke dalam server.
  # POST / PUT / PATCH / DELETE
  type Mutation {
    addBook(payload : BookInput): Book
    updateBook(bookId: ID, payload: BookInput): Book
  }
`;


// initial data yang kita punya, anggep ini data dari database sementara
const books = [
    {
        id: 1,
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        id: 2,
        title: 'City of Glass',
        author: 'Paul Auster',
    }
];


// Resolver seperti controller (REST API), berisi semua logic yang berhubungan untuk mendapatkan datanya
const resolvers = {
    Query: {
        books: (parent, args, contextValue, info) => {
            // your logic
            console.log(contextValue.authN)
            console.log(contextValue.authZ)

            return books
        },
        book: (parent, args, contextValue, info) => {
            log
            // cara dapetin ID nya gimana?
            // by default, setiap resolver menerima 4 parameter
            const { bookId } = args

            const book = books.find((el) => el.id === +bookId)

            return book
        }
    },
    Mutation: {
        addBook: (parent, args, contextValue, info) => {
            const { payload } = args
            const { title, author } = payload

            const newBook = {
                id: books.length + 1,
                title,
                author
            }

            books.push(newBook)

            return newBook
        },
        updateBook: (parent, args, contextValue, info) => {
            const { bookId, payload } = args
            const { title, author } = payload

            const bookIndex = books.findIndex((el) => el.id === +bookId)

            if (bookIndex === -1) {
                throw new Error('Book not found')
            }

            books[bookIndex] = {
                ...books[bookIndex],
                title,
                author
            }

            return books[bookIndex]
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);