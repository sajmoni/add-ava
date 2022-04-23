import { execa } from 'execa'
import { readPackage } from 'read-pkg'
import { writePackage } from 'write-pkg'
import sortPackageJson from 'sort-package-json'
import task from 'tasuku'

const run = async () => {
  await task.group((task) => [
    task('Install dependencies', async () => {
      await execa('npm', [
        'install',
        '--save-exact',
        'ava@4.1.0',
        'esbuild-runner@2.2.1',
      ])
    }),
    task('Update package.json', async () => {
      const packageJson = await readPackage({ normalize: false })
      await writePackage(
        'package.json',
        sortPackageJson({
          ...packageJson,
          ...(packageJson.scripts
            ? {
                scripts: {
                  ...packageJson.scripts,
                  test: 'ava',
                },
              }
            : {
                scripts: {
                  test: 'ava',
                },
              }),
          ava: {
            register: ['esbuild-runner/register'],
            extensions: ['ts'],
          },
        }),
      )
    }),
  ])
  await task('Done!', () => true)
}

const foo = async () => {
  await run()
}

foo()
