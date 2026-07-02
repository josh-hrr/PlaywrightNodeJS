import { test, expect, Locator } from '@playwright/test'

test.describe("Random test suite", () => {
  
  test.beforeEach( async ({page}) => {
    await page.goto('https://www.random.org/strings/');
  })
  
  test("TC1 make sure the strings meet expected behaviour", async ({page}) => {
    await page.locator('input[name="num"]').fill("7");
    
    
    await page.locator('input[name="len"]').fill("7");
    await page.locator('input[name="upperalpha"]').check();
    await page.locator('input[name="loweralpha"]').check();
    await page.locator('input[value="Get Strings"]').click();

    const result = await page.locator('.data').textContent(); 

    const arrayResult = result?.split(' ')

    if (arrayResult != undefined) {


      if (arrayResult[0].length == 7) {
        console.log('Array length is', arrayResult[0]); 
        //7strings
        expect(arrayResult[0].length).toHaveLength(7);
        expect(arrayResult[0]).toBe("string")
        expect(arrayResult[0]).toBe('number');  

        //expect(arrayResult[0]).toContain("")

        //string is unique 

        // ArrayList 
        
        const newSet = new Set()
        const result = arrayResult.map((value) => {
          newSet.add(value)

          
        })

        console.log(newSet)

        if (newSet.size == 0) {
          console.log("set length, no duplicates")
        }
        
        /*
        for (let i = 0; i < arrayResult.length; i++) {
          if (arrayResult[i] == arrayResult[i + 1]){
            console.log("Re")
          }
          */
        } 
        
    }

    

    //strings are unique
    

    //strings contain a number, lowercase, uppercase 
    
    
    //console.log('reviewing output', arrayResult[0]);

    

  })
}) 