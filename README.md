# djaclick

An example of using ClickHouse timeseries data in a Django application.

Because I didn't know Django and I thought it'd be nice to use it with
ClickHouse and get a graph.

## Clickhouse

- Install ClickHouse.

- Start the server:

  ```
  ./clickhouse server
  ```

- Start the client:

  ```
  ./clickhouse client
  ```

- And create the table for the data:

  ```
  CREATE TABLE hits
  (
      `ts` DateTime,
      `status` LowCardinality(String),
      `method` LowCardinality(String),
      `path` String
  )
  ENGINE = MergeTree
  ORDER BY ts
  ```

### Inserting ClickHouse data

The data is generated via Go and inserted via Vector.

```
brew tap vectordotdev/brew && brew install vector
go build main.go | vector --config vector.toml
```

## The Django app

- Install Python and Nodejs, the versions I used were:

  ```
  asdf install python 3.10.13
  asdf install nodejs 18.19.0
  ```

- After cloning this repository, in the repository:

  ```
  python -m venv venv
  source ./venv/bin/activate.fish
  pip install -r requirements.txt
  ```

- Pip installed a Django tailwind plugin. It needs initialising. The Django
  application has all the relevant settings, just the init, install and start
  need to be run, specifically:

  ```
  cd djaclick
  python manage.py tailwind init
  python manage.py tailwind install
  python manage.py tailwind start
  ```

  Use `theme` as the name. It should set up the `theme` directory.

  These are taken from
  [Installation — Django-Tailwind 2.0.0 documentation](https://django-tailwind.readthedocs.io/en/latest/installation.html).
  The app configuration should all be set up correctly already, so those steps
  are not needed.

- Try running the server:

  ```
  cd djaclick
  python manage.py runserver
  ```

- Open [Hits Demo](http://localhost:8000/hits/).

## Chart.js

Some references:

- [Time Cartesian Axis | Chart.js](https://www.chartjs.org/docs/latest/axes/cartesian/time.html)

## Clickhouse and Python

Some references:

- [A Python client working example for connecting to ClickHouse Cloud Service | ClickHouse Docs](https://clickhouse.com/docs/knowledgebase/python-clickhouse-connect-example)
