/*************************************************** 
* Objetivo: Controller responsável pela regra de negócio do CRUD do jogo
* Data: 17/04/2025
* Autor: Rafa
* Versão: 1.0
****************************************************/

//Import do arquivo de configuração para mensagens e status code 
const MESSAGE = require('../../modulo/config.js')

//Import do DAO para realizar o CRUD no BD
const avaliacaoDAO = require('../../model/DAO/avaliacao.js')

//Função para inserir um novo fabricante
const inserirAvaliacao = async function(avaliacao, contentType){
    try {

        if(contentType == 'application/json'){
        if
        (avaliacao.data_avaliacao         == undefined   || avaliacao.data_avaliacao            == ''   ||  avaliacao.data_avaliacao            == null     || 
         avaliacao.nota                   == undefined   || avaliacao.nota                      == ''   ||  avaliacao.nota                      == null     || avaliacao.nota.length                  > 45 ||
         avaliacao.comentario             == undefined   || avaliacao.comentario                == ''   ||  avaliacao.comentario.length            > 45  
        ){
            return MESSAGE.ERROR_REQUIRED_FILES //400
        }else{
            //Encaminha os dados do novo jogo para ser inserido no BD
            let resultAvaliacao = await avaliacaoDAO.insertAvaliacao(avaliacao)

            if(resultAvaliacao)
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

//Função para atualizar um jogo
const atualizarAvaliacao = async function(avaliacao, id, contentType){
    try{

        if(contentType == 'application/json'){
            if
        (avaliacao.data_avaliacao            == undefined   || avaliacao.data_avaliacao            == ''   ||  avaliacao.data_avaliacao            == null     || 
            avaliacao.nota                   == undefined   || avaliacao.nota                      == ''   ||  avaliacao.nota                      == null     || avaliacao.nota.length                  > 45 ||
            avaliacao.comentario             == undefined   || avaliacao.comentario                == ''   ||  avaliacao.comentario.length            > 45  
        ){
                return MESSAGE.ERROR_REQUIRED_FILES //400
            }else{
                //Validar se o id existe no BD
                let resultAvaliacao = await buscarFabricante(parseInt(id))

                if(resultFabricante.status_code == 200){
                    //Update
                    //Adiciona um atributo id no JSON para encaminhar id da requisição
                    fabricante.id = parseInt(id)
                    let result = await fabricanteDAO.updateFabricante(fabricante)

                    if(result){
                        return MESSAGE.SUCCESS_UPDATE_ITEM //200
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }

                }else if(resultFabricante.status_code == 404){
                    return MESSAGE.ERROR_NOT_FOUND //404
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
                }
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    }catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para excluir um jogo
const excluirFabricante = async function(id) {
    try {
  
      // Verifica se o ID foi passado corretamente
      if (id == undefined || id == '' || isNaN(id)) {
        return MESSAGE.ERROR_REQUIRED_FILES // 400 
      }
      if(id){
        let verificar = await fabricanteDAO.selectByIDFabricante(id)
        let resultFabricante = await fabricanteDAO.deleteFabricante(id)

        if(verificar != false || typeof(verificar) == 'object'){
            if(verificar.length > 0){
                if(resultFabricante){
                    return MESSAGE.SUCCESS_DELETED_ITEM
                }else {
                    return MESSAGE.ERROR_NOT_DELETE
                }
            }else {
                return MESSAGE.ERROR_NOT_DELETE
            }
          }else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
          }
        } 
    }catch (error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//Função para retornar todos os jogos
const listarFabricante = async function(){
    try{
        let dadosFabricante = {}

    //Chamo a função para retornar os dados do jogo
        let resultFabricante = await fabricanteDAO.selectAllFabricante()

        if(resultFabricante != false || typeof(resultFabricante) == 'object'){
        if(resultFabricante.length > 0){

            //Cria um objeto do tipo JSON para retornar a lista de jogos 
            dadosFabricante.status = true
            dadosFabricante.status_code = 200
            dadosFabricante.items = resultFabricante.length
            dadosFabricante.games = resultFabricante

            return dadosFabricante//200
        }else {
            return MESSAGE.ERROR_NOT_FOUND //404
        }
    }else{
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
    }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }    
}

//Função para buscar um jogo
const buscarFabricante = async function(id) { //recebe ID
    try {
        let dadosFabricante = {}

        //verifica se o ID foi passado correto
        if (id == undefined || id == '' || isNaN(id)) {
            return MESSAGE.ERROR_REQUIRED_FILES //400
        }

        let resultFabricante = await fabricanteDAO.selectByIDFabricante(id)

        if (resultFabricante) {
            dadosFabricante.status = true
            dadosFabricante.status_code = 200
            dadosFabricante.game = resultFabricante

            return dadosFabricante  //200
        } else {
            return MESSAGE.ERROR_NOT_FOUND //404
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

module.exports = {
    inserirAvaliacao,
    atualizarFabricante,
    excluirFabricante,
    listarFabricante,
    buscarFabricante
}