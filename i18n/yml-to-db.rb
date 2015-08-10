require 'yaml'
require 'sqlite3'
require 'fileutils'

db_file = File.expand_path("../lib/i18n.sqlite3")

FileUtils.rm_f db_file

# Open a database
db = SQLite3::Database.new db_file

db.execute <<-SQL
CREATE TABLE i18n (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    lang   TEXT    NOT NULL,
    class  TEXT    NOT NULL,
    txt_id TEXT    NOT NULL,
    txt    TEXT
);
SQL

Dir['*.yml'].each do |f|
  data = YAML.load_file(f)

  data.each do |lang, class_data|

    class_data.each do |class_name, texts|

      texts.each do |txt_id, txt|

        db.execute("INSERT INTO i18n (lang, class, txt_id, txt)
            VALUES (?, ?, ?, ?)", [lang, class_name, txt_id, txt])
      end

    end
  end
end
