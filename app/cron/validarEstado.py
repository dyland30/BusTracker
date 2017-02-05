#job que establece estado desconectado

import pymongo
import pprint
import datetime

print "Iniciando Script"

from pymongo import MongoClient
from config import Config

f = file('config.cfg')
cfg = Config(f)



client = MongoClient(cfg.dbserver.ruta,cfg.dbserver.puerto)
db = client.HaulRadarDB
db.authenticate(cfg.dbserver.usuario,cfg.dbserver.clave)

print "conectado a la BD"

unidadCollection = db.unidads
historialCollection = db.unidadhistorials
fechaActual = datetime.datetime.now()


#pprint.pprint(unidadCollection)
#buscar unidades solo con estado activo A
unidades = unidadCollection.find()

for unidad in unidades:
    #pprint.pprint(unidad)
    #pprint.pprint (unidad['_id'])
    print unidad['properties']['identificador']
    #buscar historial de unidades
    historialunidad = historialCollection.find({'properties.idUnidad':unidad['_id']}).sort('properties.fecha_registro',-1).limit(1)
    for unidHist in historialunidad:
        #print "Historial Unidad " + unidad['properties']['identificador']
        #pprint.pprint(unidHist)
        fechaReg = unidHist['properties']['fecha_registro']
        diff = fechaActual - fechaReg
        segundos = diff.total_seconds()
        #si no esta conectado por mas de 300 segundos actualizar estado de unidad
        if segundos>=300:
            #actualizar estado de unidad
            result = unidadCollection.update_one({'_id':unidad['_id']},{'$set':{'properties.estado':'D'}})
            #unidad actualizada
            print  str(result.matched_count) +" "+ str(result.modified_count) + " unidad modificada "

#cerrar conexion
client.close()
