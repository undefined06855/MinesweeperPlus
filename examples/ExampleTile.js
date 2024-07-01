/*
 * Example tile for MinesweeperPlus
 * See ./tiles/base/BaseTile.js for a list of the methods that can be modified,
 * as well as a description for each of them
 * Similiarily see BaseMineTile.js for ones for a mine
 * Other tiles are at ./tiles/*.js
 * 
 * 
 * All that has to be modified is `init`, `draw` and `drawPreview`, although
 * you dont have to hook all of them - it's just what you really need as a
 * minumum if you're not already extending some other tile, like what LyingTile
 * does (it extends GenericTile)
 */

class ExampleTile extends BaseTile {
    // no constructor here - everything inside a tile is `static`

    // here's the general tile info:
    static name = "Example Tile!!"
    static description = [ "This is the example tile!", "Use new strings to make a", "", "line break!" ]

    static async load() {
        // load assets here
        // Utils.tileLoadImageAssets can be used if the tile has assets in the
        // "vanilla" tile asset location (./assets/tiles/NAME/*.png)
        // but we don't have any assets to load on this tile since we'll only be
        // using global assets
    }

    /**
     * @param {Cell} cell 
     */
    static init(cell) {
        // this runs when the tile is created on the board
        // mind you - not when the board is first generated! since the board
        // gets entirely regenerated if the player clicks on a mine - be wary of
        // that
        
        // we can store stuff in the cell passed to this function, as that is a 
        // common reference to the space this tile lives in
        // custom data should be stored in `cell.data.*` which can be any type
        // but there's no checking where you store your shit
        cell.data.testingSavingAValue = `Column ${cell.col}!`
    }

    /**
     * @param {Cell} cell
     */
    static draw(cell) {
        // ah, the draw function
        // this is (obviously) where you draw your tile
        // you want to draw it at x 0, y 0 and with a size of sweeper.tileSize
        // since it gets translated into the correct place for you
        // the canvas rendering context is a global `ctx` variable
        // and deltatime can be accessed through the global `dt` variable
        // (in milliseconds)
        ctx.drawImage(
            GlobalAssets.googIcons.settings,
            0, 0,
            sweeper.tileSize, sweeper.tileSize
        )

        // Fonter can be used to quickly get fonts
        // this is the example of the data being saved to the cell
        ctx.font = Fonter.get(FontFamily.RockSalt, 15)
        ctx.fillStyle = "#000000"
        ctx.fillText(cell.data.testingSavingAValue, 0, 0)

        // GlobalAssets stores assets that are loaded at all times, you can
        // safely use them.
        // you could also use assets from other tiles here like GenericTile,
        // but that isnt a good idea in case another tile removes them for
        // whatever reason!
    }

    /**
     * @param {number} index 
     * @param {number} width 
     * @param {number} height 
     */
    static drawPreview(index, width, height) {
        // this runs when the tile's preview sprite needs to be drawn
        // index is a number that can be used to seed random generators for 
        // different tile sprites if needed (just look at GenericTile)

        // let's draw a random background using the index as a seed
        ctx.fillStyle = `hsl(${index}deg, 50%, 50%)`
        ctx.fillRect(0, 0, width, height)

        // in this case we'll draw the global settings icon for the setup screen
        ctx.drawImage(
            GlobalAssets.googIcons.tune,
            0, 0, // draw at 0, 0 again
            width, height
        )
    }
}

// Want to listen for the LoadHandlerRegisterTiles event to add the tile
document.addEventListener(LoadEvent.LoadHandlerRegisterTiles, async () => {
    await tileManager.register(ExampleTile)
})
