'use strict'

const { test } = use('Test/Suite')('Video')

test('Should GET all videos at /videos (no aggregates)', async ({ client, assert }) => {
  //make GET request for a fakeUser
  const fakeData = {
    user_id: 1,
    url: randomstring.generate(10),
    title: randomstring.generate(10),
    description: randomstring.generate(10)
  }
  const fakeVideo = await Video.create(fakeData)

//make GET request, assert the fake user is present
const response = await client.get('/videos').end()
response.assertStatus(200);
response.assertJSONSubset([fakeData])

//remove fake user using Adonis
await fakeVideo.delete()
})



// test('Should POST a new video at /videos ', async ({ client }) => {
//     //make POST request for a fakeVideo
//     const fakeData = {
//       user_id: 1,
//       // url: randomstring.generate(10),
//       title: randomstring.generate(10),
//       description: randomstring.generate(10)
//     }
//     // const fakeVideo = await Video.create(fakeData)
//     const response = await client
//       .post('/videos/')
//       .field('user_id', 1)
//       .field('title', fakeData.title)
//       .field('description', fakeData.description)
//       .attach('video', Helpers.resourcesPath('waits.mp4'))
//       // .send(fakeData)
//       .end()
  
//     //find posted Video, fail if not found
//     const foundVideo = await Video.findByOrFail(fakeData);
//     // console.log(foundUser['$attributes'])
  
//     //remove fake user using Adonis
//     await foundVideo.delete()  
// })