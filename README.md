# Unnamed Discord Bot

## Contents

1.  [About](#About)
2.  [Prerequistes](#Prerequistes)
3.  [Installation](#Installation)
4.  [Usage](#Usage)
5.  [Contributors](#Contributors)

## About

A discord bot with a few functionalities.

## Prerequistes

1.  Access to discord
2.  Nodejs, npm/yarn

## Installation

Clone the repository on your local machine.
Install the node packages using the following

```bash
node i && node i -D
```
or

```bash
yarn add && yarn add --dev
```

## Usage

Make sure to set all the environment variables given in [sampleenv.txt](./sampleenv.txt) in a ```.env``` file.
In the following code examples, ```<prefix>``` is whatever string you set in your environment variables.

### make invite N

This command generates `N` unique invite links, where `N` is any number.

```
<prefix>make invite 100
```
The above command generates 100 single use invite links.

### update

In order to use this command, add an excel sheet in the `pathToRoles` folder you set in your environment variables. Make sure the excel sheet has the same name as the rolename you set in your `roles.json` file.

This command will go through all the excel sheets present in the folder and give the users the required role.

```
<prefix>update
```

Make sure to set all the roles in a ```roles.json``` file present in the root directory of the project.
The file should have 1 json object with multiple entries, where each entry is a role.

```
    {
        "MAINROLE" : {
            "roleName": "Organiser",
            "fileName": "Organiser"
        },
        "Organiser": {
            "roleName": "Organiser",
            "fileName": "Organiser"
        },
        "Round1": {
            "roleName": "Round 1",
            "fileName": "Round1"
        }
    }
```

1.  This is an example of how the `roles.json` file would look like.
2.  `roleName` is the actual name of the role in the discord server.
3.  `fileName` is the name of the excel sheet in the folder that contains the excel sheets.
4.  The key is the roleName understandable by the code.
5.  `MAINROLE` is the only role apart from server owner which has access to the above roles.

## Contributors

1.  [Anupama Nhavalore](https://github.com/anupama-nhavalore)
2.  [Nihal Ramaswamy](https://github.com/nihal-ramaswamy)

