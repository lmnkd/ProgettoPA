import Sequelize from "sequelize";

// Models
import { initUserModel, User } from "./User";
import { initVaccinoModel, Vaccino } from "./Vaccino";
import { initLottoVaccinoModel, LottoVaccino } from "./LottoVaccino";
import { initVaccinazioneModel, Vaccinazione } from "./Vaccinazione";


// Inizializzazione modelli tramite Sequelize

export function initModels(sequelize: Sequelize.Sequelize) {

    // =========================
    // 1. INIT MODELS
    // =========================
    initUserModel(sequelize);
    initVaccinoModel(sequelize);
    initLottoVaccinoModel(sequelize);
    initVaccinazioneModel(sequelize);

    // =========================
    // 2. ASSOCIAZIONI
    // =========================

    // USER -> VACCINAZIONI (1:N)
    User.hasMany(Vaccinazione, {
        foreignKey: "userCf",
        sourceKey: "cf"
    });

    Vaccinazione.belongsTo(User, {
        foreignKey: "userCf",
        targetKey: "cf"
    });

    // VACCINO -> LOTTI (1:N)
    Vaccino.hasMany(LottoVaccino, {
        foreignKey: "vaccinoId",
        as: "lotti"
    });

    LottoVaccino.belongsTo(Vaccino, {
        foreignKey: "vaccinoId"
    });

    // VACCINO -> VACCINAZIONI (1:N)
    Vaccino.hasMany(Vaccinazione, {
        foreignKey: "vaccinoId"
    });

    Vaccinazione.belongsTo(Vaccino, {
        foreignKey: "vaccinoId"
    });

    // LOTTO -> VACCINAZIONI (1:N)
    LottoVaccino.hasMany(Vaccinazione, {
        foreignKey: "lottoId"
    });

    Vaccinazione.belongsTo(LottoVaccino, {
        foreignKey: "lottoId"
    });

    // =========================
    // 3. EXPORT MODELS
    // =========================
    return {
        User,
        Vaccino,
        LottoVaccino,
        Vaccinazione
    };
}