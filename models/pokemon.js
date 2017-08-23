function exportPokemon (sequelize, DataTypes) {
	const Pokemon = sequelize.define('pokemon', {
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		stock: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		}
	})
	
	return Pokemon
}

module.exports = exportPokemon