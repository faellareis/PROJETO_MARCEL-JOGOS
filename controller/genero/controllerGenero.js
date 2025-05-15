/*************************************************** 
* Objetivo: Controller responsável pela regra de negócio do CRUD do jogo
* Data: 10/04/2025
* Autor: Rafa
* Versão: 1.0
****************************************************/

//Import do arquivo de configuração para mensagens e status code 
const MESSAGE = require('../../modulo/config.js')

//Import do DAO para realizar o CRUD no BD
const generoDAO = require('../../model/DAO/genero.js')

//Função para inserir um novo genero
const inserirGenero = async function(genero, contentType){
    try {

        if(String(contentType).toLowerCase() == 'application/json')
        {
                if
        (genero.nome_genero              == undefined   || genero.nome_genero                 == ''   ||  genero.nome_genero                == null     ||  genero.nome_genero .length          > 45 ||
         genero.descricao_genero         == undefined   || genero.descricao_genero            == ''   ||  genero.descricao_genero           == null   
        ){
            return MESSAGE.ERROR_REQUIRED_FILES //400
        }else{
            //Encaminha os dados do novo jogo para ser inserido no BD
            let resultGenero = await generoDAO.insertGenero(genero)

            if(resultGenero)
                return MESSAGE.SUCESS_CREATED_ITEM //201
            else
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para atualizar um genero
const atualizarGenero = async function(genero, id, contentType){
    try{

        if(String(contentType).toLowerCase() == 'application/json')
        {
            if
        (id                              == ''          || id                          == undefined    || id                          == null     || isNaN(id)  || id  <= 0   ||
            genero.nome                  == undefined   || genero.nome                 == ''           ||  genero.nome                == null     ||
         genero.descricao                == undefined   || genero.descricao            == ''           ||  genero.descricao           == null  
        ){
                return MESSAGE.ERROR_REQUIRED_FILES //400
            }else{
                //Validar se o id existe no BD
                let resultGenero = await buscarGenero(parseInt(id))

                if(resultGenero != false || typeof(resultGenero) == 'object'){
                    if(resultGenero.length > 0 ){
                        //Update
                        //Adiciona o ID do genero no JSON com os dados
                        genero.id = parseInt(id)

                        let result = await generoDAO.updateGenero(genero)

                        if(result){
                            return MESSAGE.SUCCESS_UPDATED_ITEM //200
                        }else{
                            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    }else{
                        return MESSAGE.ERROR_NOT_FOUND //404
                    }
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
} catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
}
}

//Função para excluir um genero
const excluirGenero = async function(id) {
        try {
            if(id == '' || id == undefined || id == null || isNaN(id) || id <=0){
                return MESSAGE.ERROR_REQUIRED_FILES //400
    }else{

        //Funcção que verifica se  ID existe no BD
        let resultGenero = await generoDAO.selectByIdGenero(parseInt(id))

        if(resultGenero != false || typeof(resultGenero) == 'object'){
            //Se existir, faremos o delete
            if(resultGenero.length > 0){
                //delete
                let result = await generoDAO.deleteGenero(parseInt(id))

                if(result){
                    return MESSAGE.SUCCESS_DELETED_ITEM //200
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }else{
                return MESSAGE.ERROR_NOT_FOUND //404
            }
        }else{
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }
    }
} catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
}
}

//Função para retornar todos os gêneros
const listarGenero = async function() {
    try {
      let dadosGenero = {}
  
      let resultGenero = await generoDAO.selectAllGenero();
  
      if(resultGenero != false || typeof(resultGenero) == 'object'){
        if(resultGenero.length > 0){
            //Criando um JSON de retorno de dados para a API
            dadosGenero.status = true
            dadosGenero.status_code = 200
            dadosGenero.items = resultGenero.length
            dadosGenero.films = resultGenero

            return dadosGenero
        }else{
            return MESSAGE.ERROR_NOT_FOUND //404
        }
    }else{
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
    }
} catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
}
  }
  

//Função para buscar um genero
const buscarGenero = async function(id) { //recebe ID
     try {
        if(id == '' || id == undefined || id == null || isNaN(id) || id <=0){
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }else{
            dadosGenero = {}

            let resultGenero = await generoDAO.selectByIdgenero(parseInt(id))
            
            if(resultGenero != false || typeof(resultGenero) == 'object'){
                if(resultGenero.length > 0){
                     //Criando um JSON de retorno de dados para a API
                    dadosGenero.status = true
                    dadosGenero.status_code = 200
                    dadosGenero.genero = resultGenero

                    return dadosGenero //200
                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

module.exports = {
    inserirGenero,
    atualizarGenero,
    excluirGenero,
    listarGenero,
    buscarGenero
}