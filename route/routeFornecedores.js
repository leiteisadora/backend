const express = require('express'); 
 
const router = express.Router(); 
 
const mysql = require("../mysql").pool; 
 
// LISTAR FORNECEDORES 
 
router.get('/', (req, res) => { 
 
    mysql.getConnection((error, conn) => { 
 
        if (error) return res.status(500).send({ error }); 
 
        conn.query("SELECT * FROM fornecedores", (error, resultado) => { 
 
            conn.release(); 
 
            if (error) return res.status(500).send({ error }); 
 
            res.status(200).send({ fornecedor: resultado }); 
 
        }); 
 
    }); 
 
}); 
 
// lista apenas um fornecedor 
router.get('/:id', (req, res, next) => { 
 
    mysql.getConnection((error, conn) => { 
 
        if (error) return res.status(500).send({ error: error }); 
 
        conn.query( 
            "SELECT * FROM fornecedores WHERE id_fornecedor = ?", 
            [req.params.id], 
            (error, resultado) => { 
 
                conn.release(); 
 
                if (error) return res.status(500).send({ error: error }); 
 
                res.status(200).send({ fornecedor: resultado }); 
 
            } 
        ); 
 
    }); 
 
}); 
 
 
router.post('/', (req, res, next) => { 
 
    mysql.getConnection((error, conn) => { 
 
        if (error) return res.status(500).send({ error: error }); 
 
        conn.query( 
            "INSERT INTO fornecedores (nome, empresa, email, telefone, cidade, estado) VALUES (?, ?, ?, ?, ?, ?)", 
            [ 
                req.body.nome, 
                req.body.empresa, 
                req.body.email, 
                req.body.telefone, 
                req.body.cidade, 
                req.body.estado
            ], 
            (error, resultado) => { 
 
                console.log(error); 
 
                conn.release(); 
 
                if (error) return res.status(500).send({ error: error }); 
 
                res.status(201).send({ 
                    mensagem: "Fornecedor criado com sucesso!", 
                    id_fornecedor: resultado.insertId 
                }); 
 
            } 
        ); 
 
    }); 
 
}); 
 
 
router.patch('/:id', (req, res, next) => { 
 
    mysql.getConnection((error, conn) => { 
 
        if (error) return res.status(500).send({ error: error }); 
 
        conn.query( 
            "UPDATE fornecedores SET nome = ?, empresa = ?, email = ?, telefone = ?, cidade = ?, estado = ? WHERE id_fornecedor = ?", 
            [ 
                req.body.nome, 
                req.body.empresa, 
                req.body.email, 
                req.body.telefone, 
                req.body.cidade, 
                req.body.estado, 
                req.params.id
            ], 
            (error, resultado) => { 
 
                conn.release(); 
 
                if (error) return res.status(500).send({ error: error }); 
 
                res.status(202).send({ 
                    mensagem: "Fornecedor atualizado com sucesso!" 
                }); 
 
            } 
 
        ); 
 
    }); 
 
}); 
 
 
router.delete('/:id', (req, res, next) => { 
 
    mysql.getConnection((error, conn) => { 
 
        if (error) return res.status(500).send({ error: error }); 
 
        conn.query( 
            "DELETE FROM fornecedores WHERE id_fornecedor = ?", 
            [req.params.id], 
            (error, resultado) => { 
 
                conn.release(); 
 
                if (error) return res.status(500).send({ error: error }); 
 
                res.status(202).send({ 
                    mensagem: "Fornecedor removido com sucesso!" 
                }); 
 
            } 
 
        ); 
 
    }); 
 
}); 
 
module.exports = router;


